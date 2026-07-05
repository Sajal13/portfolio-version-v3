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
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} from './utils/cookie.util';
import { AccessTokenResponseDto } from './dto/token-response.dto';
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
  @ApiResponse({ status: 201, type: AccessTokenResponseDto })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    setRefreshTokenCookie(res, refreshToken, this.config);
    return { accessToken };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  async login(
    @CurrentUser() user: { id: number; email: string; role: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(user);
    setRefreshTokenCookie(res, refreshToken, this.config);
    return { accessToken };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Get a new access token using the refresh cookie' })
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  async refresh(
    @CurrentUser() user: { sub: number; refreshToken: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken
    );
    setRefreshTokenCookie(res, refreshToken, this.config);
    return { accessToken };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear refresh cookie' })
  async logout(
    @CurrentUser() user: { userId: number },
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(user.userId);
    clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }
}
