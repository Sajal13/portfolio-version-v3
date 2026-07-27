'use client';

import React, { PropsWithChildren } from 'react';
import { TabsContextValue, TabsProps } from '@/types/tabs';

const TabsContext = React.createContext<TabsContextValue | null>(null);

let tabsIdCounter = 0;

const TabsProvider = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  children
}: PropsWithChildren<TabsProps>) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '');
  const isControlled = valueProp !== undefined;
  const value = isControlled ? (valueProp as string) : uncontrolled;
  const idPrefix = React.useRef(`tabs-${++tabsIdCounter}`).current;

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );
  return (
    <TabsContext.Provider value={{ value, setValue, idPrefix }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabsContext = (component: string) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`${component} must be used within <Tabs>`);
  return ctx;
};

export default TabsProvider;
