import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Resolves the real client IP address.
 *
 * With `app.set('trust proxy', 1)` set in main.ts, Express already parses
 * X-Forwarded-For into `req.ip` correctly in most setups. This decorator
 * adds explicit fallbacks for edge cases (Cloudflare, misconfigured
 * proxies) so IP resolution doesn't silently fall back to the proxy's
 * own address.
 */
export const ClientIp = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();

    // X-Forwarded-For can contain a comma-separated list of IPs
    // (client, proxy1, proxy2, ...) — the first entry is the original client.
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      const firstIp = forwardedFor.split(',')[0]?.trim();
      if (firstIp) return firstIp;
    }

    // Cloudflare sends the original client IP in this dedicated header.
    const cfConnectingIp = req.headers['cf-connecting-ip'];
    if (typeof cfConnectingIp === 'string' && cfConnectingIp.length > 0) {
      return cfConnectingIp;
    }

    // Falls back to Express's own resolution (accurate once trust proxy
    // is set), then the raw socket address as a last resort.
    return req.ip ?? req.socket.remoteAddress ?? 'unknown';
  }
);
