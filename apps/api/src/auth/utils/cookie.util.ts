import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Response } from 'express';

// Cross-domain (Vercel/Netlify frontend -> Render backend) requires
// sameSite: 'none' + secure: true on every auth-related cookie.
// secure: true is mandatory here regardless of NODE_ENV — browsers
// silently drop 'none' cookies sent without it, and both Render and
// Vercel/Netlify serve over HTTPS by default, so this is always safe.

const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60 * 1000; // keep in sync with jwt.accessExpiresIn
const REFRESH_TOKEN_MAX_AGE_REMEMBER = 30 * 24 * 60 * 60 * 1000; // 30d for "remember me"

const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/'
};

// ---------- Access token ----------

export function setAccessTokenCookie(
  res: Response,
  accessToken: string,
  _config: ConfigService
) {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE
  });
}

export function clearAccessTokenCookie(res: Response) {
  res.clearCookie('accessToken', {
    ...baseCookieOptions
  });
}

// ---------- Refresh token ----------

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
  _config: ConfigService,
  rememberMe = false
) {
  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    path: '/api/v1/auth', // scoped — only sent to auth routes, not every endpoint
    // rememberMe -> persistent cookie (30d). Otherwise -> session cookie
    // (no maxAge = browser drops it on close). The refresh JWT itself
    // must be signed with a matching expiresIn in AuthService.issueTokens.
    ...(rememberMe ? { maxAge: REFRESH_TOKEN_MAX_AGE_REMEMBER } : {})
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    ...baseCookieOptions,
    path: '/api/v1/auth'
  });
}

// ---------- CSRF token (double-submit cookie pattern) ----------
// Not HttpOnly on purpose — frontend JS must read this to echo it
// back as a header on mutating requests. It's not a secret by itself;
// its security comes from cross-origin JS being unable to read it.

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(
  res: Response,
  csrfToken: string,
  rememberMe = false
) {
  res.cookie('csrfToken', csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/',
    ...(rememberMe ? { maxAge: REFRESH_TOKEN_MAX_AGE_REMEMBER } : {})
  });
}

export function clearCsrfCookie(res: Response) {
  res.clearCookie('csrfToken', {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
}

// ---------- Convenience: set/clear all three together ----------

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  config: ConfigService,
  rememberMe = false
) {
  setAccessTokenCookie(res, tokens.accessToken, config);
  setRefreshTokenCookie(res, tokens.refreshToken, config, rememberMe);
  setCsrfCookie(res, generateCsrfToken(), rememberMe);
}

export function clearAuthCookies(res: Response) {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
  clearCsrfCookie(res);
}
