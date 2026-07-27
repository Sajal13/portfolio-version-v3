'use client';

import React from 'react';
import { cn } from '../utils/cn';

type InputOTPProps = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
};

function InputOTP({
  length = 6,
  value: valueProp,
  defaultValue = '',
  onChange,
  onComplete,
  disabled,
  className,
  containerClassName
}: InputOTPProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? (valueProp as string) : uncontrolled;
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (index: number, digit: string) => {
    const clean = digit.replace(/[^a-zA-Z0-9]/g, '').slice(-1);
    const chars = value.split('');
    chars[index] = clean;
    const next = chars.join('').slice(0, length);
    setValue(next);
    if (clean && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowLeft' && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1)
      inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, length);
    setValue(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      data-slot="input-otp"
      className={cn('flex items-center gap-2', containerClassName)}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          inputMode="text"
          maxLength={1}
          disabled={disabled}
          value={value[index] ?? ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            `size-10 rounded-md border border-main bg-secondary-700 text-center text-sm text-white outline-none transition-colors
             focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
             disabled:cursor-not-allowed disabled:opacity-50`,
            className
          )}
        />
      ))}
    </div>
  );
}

export { InputOTP };
export type { InputOTPProps };
