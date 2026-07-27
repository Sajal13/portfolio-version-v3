'use client';

import React, { PropsWithChildren } from 'react';
import { RadioGroupContextValue, RadioGroupProps } from '../types/radioGroup';

let radioGroupIdCounter = 0;

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
);

const RadioGroupProvider = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  children
}: PropsWithChildren<RadioGroupProps>) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolled;
  // Native radio inputs need a shared `name` to behave as a group
  // (this is also what gives you free arrow-key navigation between options).
  const groupName = React.useRef(
    name ?? `radio-group-${++radioGroupIdCounter}`
  ).current;

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );
  return (
    <RadioGroupContext.Provider value={{ name: groupName, value, setValue }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

export const useRadioGroupContext = (component: string) => {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error(`${component} must be used within a <RadioGroup>`);
  return ctx;
};

export default RadioGroupProvider;
