'use client';

import { useLayoutEffect, useRef } from 'react';
import { LuCircleAlert } from '@repo/icons/lu';
import { Input, Textarea } from '@repo/ui/components';
// adjust to your actual @repo/ui export path
import { cn } from '@repo/ui/utils';
// adjust to your actual @repo/ui export path
import gsap from 'gsap';
import type { ControllerRenderProps } from 'react-hook-form';
import type { ContactFormValues, StepField } from './contact.schema';

type StepMeta = { label: string; prompt: string; as: 'input' | 'textarea' };
export type StepState = 'pending' | 'active' | 'locked';

type TerminalStepFieldProps = ControllerRenderProps<
  ContactFormValues,
  StepField
> & {
  meta: StepMeta;
  state: StepState;
  error?: string;
  onAdvance: () => void;
};

// Shared look: no box, just a terminal-style line. The Input component's
// own border/bg/padding are stripped via className so it still gets the
// component's sizing, focus, and aria-invalid behavior underneath.
//
// The [&:-webkit-autofill] block neutralizes Chrome's autofill styling —
// without it, picking a suggestion paints the field with Chrome's own
// yellow/white background regardless of bg-transparent, because autofill
// styling is applied at the user-agent layer, not normal CSS specificity.
const FIELD_CLASSNAME = cn(
  'w-full flex-1 border-none bg-transparent px-0 text-sm text-gray-200 caret-[#00D4FF] outline-none placeholder:text-gray-600 focus-visible:ring-0',
  '[&:-webkit-autofill]:[-webkit-text-fill-color:#e5e7eb]',
  '[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset]',
  '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]',
  '[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset]',
  '[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset]'
);

export default function TerminalStepField({
  meta,
  state,
  error,
  onAdvance,
  name,
  value,
  onChange,
  onBlur
}: TerminalStepFieldProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (state === 'pending') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (wrapperRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: state === 'locked' ? -6 : 12 },
        {
          opacity: 1,
          y: 0,
          duration: state === 'locked' ? 0.3 : 0.4,
          ease: 'power2.out'
        }
      );
    }

    if (state === 'active') fieldRef.current?.focus();
  }, [state]);

  if (state === 'pending') return null;

  if (state === 'locked') {
    return (
      <div ref={wrapperRef} className="mb-4">
        <p className="text-sm text-gray-500">
          <span className="text-[#00D4FF]">&gt;</span> {meta.label}{' '}
          <span className="text-gray-200">{String(value)}</span>
        </p>
      </div>
    );
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    if (meta.as === 'textarea' && event.shiftKey) return; // allow newlines
    event.preventDefault();
    onAdvance();
  };

  return (
    <div ref={wrapperRef} className="mb-6">
      <p className="mb-1.5 text-sm text-gray-500">
        <span className="text-[#00D4FF]">&gt;</span> {meta.label}
      </p>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-sm text-[#00D4FF]">$</span>
        {meta.as === 'textarea' ? (
          <Textarea
            ref={fieldRef as React.Ref<HTMLTextAreaElement>}
            id={name}
            rows={3}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder={meta.prompt}
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
            className={cn(FIELD_CLASSNAME, 'resize-none focus-visible:ring-0!')}
          />
        ) : (
          <Input
            ref={fieldRef as React.Ref<HTMLInputElement>}
            id={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder={meta.prompt}
            autoComplete="off"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
            className={cn('h-auto', FIELD_CLASSNAME)}
          />
        )}
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 flex items-center gap-1.5 pl-4 text-xs text-[#FF5F56]"
        >
          <LuCircleAlert className="h-3 w-3" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
