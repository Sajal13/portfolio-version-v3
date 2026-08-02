import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { setAuthCookies, clearAuthCookies } from './utils/cookie.util';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201 })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken, rememberMe } =
      await this.authService.register(dto);
    setAuthCookies(res, { accessToken, refreshToken }, this.config, rememberMe);
    return { success: true };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({
    summary: 'Step 1: verify admin credentials and email a one-time code'
  })
  async login(
    @CurrentUser() user: { id: number; email: string; role: string },
    @Body('rememberMe') rememberMe: boolean = false
  ) {
    // passport-local's LocalStrategy only reads email/password off the
    // body to authenticate — rememberMe rides along in the same request
    // body untouched and is read here directly.
    // No cookies are set here — tokens aren't issued until the OTP step.
    return this.authService.login(user, !!rememberMe);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Step 2: verify the emailed OTP and get tokens' })
  @ApiResponse({ status: 200 })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken, rememberMe } =
      await this.authService.verifyOtp(dto.preAuthToken, dto.otp);

    setAuthCookies(res, { accessToken, refreshToken }, this.config, rememberMe);
    return { success: true };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Get a new access token using the refresh cookie' })
  @ApiResponse({ status: 200 })
  async refresh(
    @CurrentUser()
    user: { sub: number; refreshToken: string; rememberMe: boolean },
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken, rememberMe } =
      await this.authService.refreshTokens(
        user.sub,
        user.refreshToken,
        user.rememberMe
      );

    setAuthCookies(res, { accessToken, refreshToken }, this.config, rememberMe);
    return { success: true };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear auth cookies' })
  async logout(
    @CurrentUser() user: { userId: number },
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(user.userId);
    clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }
}