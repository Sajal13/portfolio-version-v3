'use client';

import { createContext, useContext, type PropsWithChildren } from 'react';
import type { Table } from '@tanstack/react-table';

const AdvanceTableContext = createContext<Table<unknown> | null>(null);

export function AdvanceTableProvider<T>({
  table,
  children
}: PropsWithChildren<{ table: Table<T> }>) {
  return (
    <AdvanceTableContext.Provider value={table as Table<unknown>}>
      {children}
    </AdvanceTableContext.Provider>
  );
}

export function useAdvanceTableContext<T>(): Table<T> {
  const ctx = useContext(AdvanceTableContext);
  if (!ctx) {
    throw new Error(
      'useAdvanceTableContext must be used within an AdvanceTableProvider'
    );
  }
  return ctx as Table<T>;
}
