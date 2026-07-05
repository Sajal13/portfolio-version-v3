import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

export function setRefreshTokenCookie(
  res: Response,
  token: string,
  config: ConfigService
) {
  const isProd = config.get('nodeEnv') === 'production';

  res.cookie('refreshToken', token, {
    httpOnly: true, // JS cannot read this cookie
    secure: isProd, // only sent over HTTPS in prod
    sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-site in prod (requires secure:true)
    path: '/auth', // cookie only sent to /auth/* routes (refresh, logout)
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, match JWT_REFRESH_EXPIRES_IN
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', { path: '/auth' });
}
