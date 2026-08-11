// packages/api-client/src/index.ts
export { backendFetch, parseOrThrow } from './core';
export type { BackendRequestOptions } from './core';

export { getPublic } from './public';
export type { PublicFetchOptions } from './public';

export { serverRequest } from './authenticated';
export type { AuthenticatedRequestOptions } from './authenticated';

export { revalidateWeb } from './revalidate';

export { api } from './client';

export { proxyToBackend } from './proxy';