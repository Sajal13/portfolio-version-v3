'use client';

import { createContext, use, useContext } from 'react';

const LoaderContext = createContext<{ ready: boolean }>({ ready: false });

export function LoaderProvider({
  ready,
  children
}: {
  ready: boolean;
  children: React.ReactNode;
}) {
  return (
    <LoaderContext.Provider value={{ ready }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoaderReady() {
  return use(LoaderContext).ready;
}
