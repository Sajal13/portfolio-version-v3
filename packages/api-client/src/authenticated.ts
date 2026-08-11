import { backendFetch, parseOrThrow } from './core';

export interface AuthenticatedRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token: string;
}

export async function serverRequest<T>(path: string, opts: AuthenticatedRequestOptions): Promise<T> {
  const { method = 'GET', body, token } = opts;
  const isFormData = body instanceof FormData;

  const res = await backendFetch(path, {
    method,
    contentType: isFormData || body == null ? undefined : 'application/json',
    headers: { authorization: `Bearer ${token}` },
    body: body == null ? undefined : isFormData ? (body as FormData) : JSON.stringify(body)
  });

  return parseOrThrow<T>(res);
}