const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const baseApiFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    signal: options?.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? 'Request failed');
  }
  return json;
};
