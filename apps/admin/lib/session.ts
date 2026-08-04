import { jwtVerify, decodeJwt } from 'jose';

export type SessionPayload = {
  sub: number;
  email: string;
  role: 'user' | 'admin';
  rememberMe?: boolean;
};

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

/**
 * Verifies signature + expiry — use this wherever the result gates access
 * to something (middleware redirects, protected data). Throws if invalid
 * or expired.
 */
export async function verifySession(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionPayload;
}

/**
 * Decodes without verifying — use ONLY for non-security display purposes
 * (e.g. showing a name in the nav) where the token has already been
 * verified elsewhere in the same request (e.g. by middleware just before).
 * Never use this to make an authorization decision.
 */
export function decodeSessionUnsafe(token: string): SessionPayload | null {
  try {
    return decodeJwt(token) as unknown as SessionPayload;
  } catch {
    return null;
  }
}
