import { backendFetch, parseOrThrow } from './core';

export interface PublicFetchOptions {
  revalidate?: number;
  tags?: string[];
}

export async function getPublic<T>(path: string, opts: PublicFetchOptions = {}): Promise<T> {
  const { revalidate = 600, tags = [] } = opts;
  const res = await backendFetch(path, { cache: { revalidate, tags } });
  return parseOrThrow<T>(res);
}