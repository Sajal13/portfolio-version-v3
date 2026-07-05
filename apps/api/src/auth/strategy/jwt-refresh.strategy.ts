import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  return req.cookies?.refreshToken || null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.get('jwt.refreshSecret') ?? '',
      passReqToCallback: true,
      ignoreExpiration: false
    });
  }

  async validate(
    req: Request,
    payload: { sub: number; email: string; role: string }
  ) {
    const refreshToken = req.cookies?.refreshToken;
    return { ...payload, refreshToken };
  }
}
