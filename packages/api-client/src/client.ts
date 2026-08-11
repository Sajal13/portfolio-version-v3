// packages/api-client/src/client.ts
type Primitive = string | number | boolean;
type QueryParams = Record<string, Primitive | Primitive[] | null | undefined>;

interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  body?: unknown;
  query?: QueryParams;
}

function buildUrl(path: string, query?: QueryParams) {
  const url = new URL(path, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  if (!query) return url.toString();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, String(v)));
    else url.searchParams.append(key, String(value));
  });
  return url.toString();
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(buildUrl(path, query), {
    method,
    credentials: 'include',
    ...rest,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers
    },
    body: body == null ? undefined : isFormData ? body : JSON.stringify(body)
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw data ?? new Error('Request failed');
  return data as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('DELETE', path, options)
};