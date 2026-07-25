'use client';

import React from 'react';
import { SelectContextValue, SelectProps } from 'types/select';
import { useFloatingPosition } from 'utils/useOverlay';

const SelectContext = React.createContext<SelectContextValue | null>(null);

const SelectProvider = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  children
}: React.PropsWithChildren<SelectProps>) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolled;
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);
  const labelMap = React.useRef<Map<string, string>>(new Map());

  const { triggerRef, floatingRef, coords } = useFloatingPosition({
    open,
    side: 'bottom',
    align: 'start',
    sideOffset: 4
  });

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      setSelectedLabel(labelMap.current.get(next) ?? next);
    },
    [isControlled, onValueChange]
  );

  // keep the displayed label in sync if `value` is controlled from outside
  React.useEffect(() => {
    if (value && labelMap.current.has(value)) {
      setSelectedLabel(labelMap.current.get(value) ?? value);
    }
  }, [value]);

  React.useLayoutEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.getBoundingClientRect().width);
    }
  }, [open, triggerRef]);

  return (
    <SelectContext.Provider
      value={{
        value,
        setValue,
        open,
        setOpen,
        triggerRef,
        floatingRef,
        coords,
        triggerWidth,
        labelMap,
        selectedLabel
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

export const useSelectContext = (component: string) => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error(`${component} must be used within a <Select>`);
  return ctx;
};

export default SelectProvider;
