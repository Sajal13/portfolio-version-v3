// packages/api-client/src/core.ts
const API_URL = process.env.API_URL;

export interface BackendRequestOptions {
  method?: string;
  body?: BodyInit | null;
  contentType?: string | null;
  headers?: Record<string, string>;
  cache?: { revalidate?: number | false; tags?: string[] };
}

export async function backendFetch(path: string, opts: BackendRequestOptions = {}): Promise<Response> {
  if (!API_URL) {
    throw new Error('API_URL is not set — required by @repo/api-client on the server');
  }

  const { method = 'GET', body, contentType, headers = {}, cache } = opts;

  return fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(contentType ? { 'content-type': contentType } : {}),
      ...headers
    },
    body,
    duplex: body != null ? 'half' : undefined,
    ...(cache ? { next: cache } : { cache: 'no-store' })
  } as RequestInit & { duplex?: 'half' });
}

export async function parseOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data ?? new Error(`Backend request failed: ${res.status}`);
  return data as T;
}