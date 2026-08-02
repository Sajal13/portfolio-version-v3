import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';

const OTP_TTL_MS = 3 * 60 * 1000; // 3 minutes — keep in sync with preAuthToken expiresIn below

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService
  ) {}

  private static readonly MAX_OTP_ATTEMPTS = 5;

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
      name: dto.name
    });

    // No rememberMe concept at registration — short-lived default session
    return this.issueTokens(user.id, user.email, user.role, false);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // Gate at the credential-check stage so non-admins never even reach the
    // OTP step or trigger an email.
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin accounts can log in');
    }

    const {
      password: _pw,
      hashedRefreshToken: _rt,
      otpCode: _otp,
      otpExpiresAt: _otpExp,
      ...safeUser
    } = user;
    return safeUser;
  }

  /**
   * Step 1 of login. Credentials + role already verified by the local
   * strategy (validateUser above). This does NOT issue access/refresh
   * tokens — it emails a one-time code and returns a short-lived
   * preAuthToken the client must send back to /auth/verify-otp.
   *
   * rememberMe is carried inside the preAuthToken itself so it survives
   * to step 2 without the client needing to resend it.
   */
  async login(
    user: { id: number; email: string; role: string },
    rememberMe: boolean
  ) {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.usersService.setOtp(user.id, otpHash, otpExpiresAt);

    const preAuthToken = await this.jwtService.signAsync(
      { sub: user.id, rememberMe },
      {
        secret: this.config.get('jwt.otpSecret'),
        expiresIn: '3m'
      }
    );

    // OTP delivery failing should block login (user has no way to get the
    // code otherwise), so let that rejection propagate. The login
    // notification email is best-effort and swallows its own errors
    // inside MailService.
    await Promise.all([
      this.mailService.sendOtpCode(user.email, otp),
      this.mailService.sendLoginNotification(user.email)
    ]);

    return { otpRequired: true, preAuthToken };
  }

  /** Step 2 of login. Verifies the emailed code and issues real tokens. */
  async verifyOtp(preAuthToken: string, otp: string) {
    let payload: { sub: number; rememberMe?: boolean };
    try {
      payload = await this.jwtService.verifyAsync(preAuthToken, {
        secret: this.config.get('jwt.otpSecret')
      });
    } catch {
      throw new UnauthorizedException('OTP session expired, please log in again');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('OTP session expired, please log in again');
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      await this.usersService.clearOtp(user.id);
      throw new UnauthorizedException('OTP expired, please log in again');
    }

    // Lock out before even touching bcrypt if attempts are exhausted
    if (user.otpAttempts >= AuthService.MAX_OTP_ATTEMPTS) {
      await this.usersService.clearOtp(user.id);
      throw new UnauthorizedException(
        'Too many incorrect attempts, please log in again'
      );
    }

    const matches = await bcrypt.compare(otp, user.otpCode);
    if (!matches) {
      const attempts = await this.usersService.incrementOtpAttempts(user.id);
      if (attempts >= AuthService.MAX_OTP_ATTEMPTS) {
        await this.usersService.clearOtp(user.id);
        throw new UnauthorizedException(
          'Too many incorrect attempts, please log in again'
        );
      }
      throw new UnauthorizedException('Invalid OTP code');
    }

    const consumed = await this.usersService.consumeOtp(user.id, user.otpCode);
    if (!consumed) {
      throw new UnauthorizedException('OTP already used, please log in again');
    }

    return this.issueTokens(user.id, user.email, user.role, !!payload.rememberMe);
  }

  async logout(userId: number) {
    await this.usersService.setRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: number, refreshToken: string, rememberMe: boolean) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!matches) {
      // Possible token theft — nuke the stored token to force re-login
      await this.usersService.setRefreshToken(userId, null);
      throw new ForbiddenException('Access denied');
    }

    // Re-issue with the same rememberMe lifetime the session started with,
    // so a "remembered" session keeps rolling forward at 30d rather than
    // silently dropping back to the short default on first refresh.
    return this.issueTokens(user.id, user.email, user.role, rememberMe);
  }

  private async issueTokens(
    userId: number,
    email: string,
    role: string,
    rememberMe: boolean
  ) {
    const payload = { sub: userId, email, role, rememberMe };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.accessSecret'),
        expiresIn: this.config.get('jwt.accessExpiresIn')
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.refreshSecret'),
        expiresIn: rememberMe ? '30d' : this.config.get('jwt.refreshExpiresIn')
      })
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken, rememberMe };
  }
}