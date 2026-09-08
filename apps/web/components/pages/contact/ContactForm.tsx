'use client';

import { useCallback, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaCheckCircle } from '@repo/icons/fa';
import { LuCircleAlert, LuLoader, LuPencil, LuSend } from '@repo/icons/lu';
import { Button } from '@repo/ui/components';
// adjust to your actual @repo/ui export path
import { Controller, useForm } from 'react-hook-form';
import TerminalStepField from './TerminalStepField';
import { MIN_FILL_TIME_MS, STEP_META, STEP_ORDER } from './contact.constants';
import {
  contactSchema,
  type ContactFormValues,
  type StepField
} from './contact.schema';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const mountedAtRef = useRef<number>(Date.now());
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' }
  });

  const isReadyToSend = activeStep >= STEP_ORDER.length;

  const advanceStep = useCallback(
    async (fieldName: StepField) => {
      const isValid = await trigger(fieldName);
      if (!isValid) return;
      setActiveStep((step) => Math.min(step + 1, STEP_ORDER.length));
    },
    [trigger]
  );

  // Jump back to an already-answered step to correct it. The field's
  // current value is preserved (react-hook-form still owns it), so the
  // person only has to re-confirm the fields after the one they fixed —
  // no restart, no retyping everything from scratch.
  const goToStep = useCallback(
    (index: number) => {
      if (status === 'sending') return;
      setStatus('idle');
      setStatusMessage('');
      setActiveStep(index);
    },
    [status]
  );

  const onSubmit = async (values: ContactFormValues) => {
    // Honeypot: a real visitor can never reach this field, so a non-empty
    // value here means a bot filled every input it could find.
    if (values.website) {
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again.');
      return;
    }

    // A submission that lands faster than a human could type it out is
    // almost certainly scripted.
    if (Date.now() - mountedAtRef.current < MIN_FILL_TIME_MS) {
      setStatus('error');
      setStatusMessage('Take a moment and try sending again.');
      return;
    }

    setStatus('sending');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message
        })
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setStatusMessage("Message transmitted. I'll respond within 24 hours.");
      reset();
      // Note: activeStep is intentionally left alone here. Resetting it to 0
      // immediately would flip `isReadyToSend` back to false and hide the
      // confirmation before anyone could read it. The dedicated success
      // screen below takes over instead, and the "send another message"
      // button on it is what actually resets the stepper.
    } catch {
      setStatus('error');
      setStatusMessage(
        'Transmission failed. Please try again or email me directly.'
      );
    }
  };

  // Dedicated confirmation screen. Replaces the form entirely once the
  // message has gone through, so the acknowledgement can't get lost behind
  // a stepper that's already collapsed back to step one.
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-[#27C93F]/30 bg-[#27C93F]/5 px-5 py-10 text-center md:px-8">
        <FaCheckCircle className="h-8 w-8 text-[#27C93F]" aria-hidden />
        <p
          role="status"
          aria-live="polite"
          className="font-mono text-sm text-[#27C93F]"
        >
          {statusMessage}
        </p>
        <Button
          type="button"
          variant="outline"
          color="primary"
          className="gap-2 border-[#00D4FF]/30 bg-[#00D4FF]/10 font-mono text-[#00D4FF] hover:bg-[#00D4FF]/15"
          onClick={() => {
            setStatus('idle');
            setStatusMessage('');
            setActiveStep(0);
            mountedAtRef.current = Date.now();
          }}
        >
          $ send_another_message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — visually hidden, out of tab order, never seen by people */}
      <Controller
        control={control}
        name="website"
        render={({ field }) => (
          <input
            {...field}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute h-0 w-0 opacity-0"
            style={{ pointerEvents: 'none' }}
          />
        )}
      />

      <div className="rounded-lg border border-white/5 bg-white/1.5 px-5 py-5 md:px-8">
        {STEP_ORDER.map((fieldName, index) => {
          const stepState =
            index < activeStep
              ? 'locked'
              : index === activeStep
                ? 'active'
                : 'pending';

          return (
            <Controller
              key={fieldName}
              control={control}
              name={fieldName}
              render={({ field }) => (
                <div className="group relative">
                  <TerminalStepField
                    {...field}
                    meta={STEP_META[fieldName]}
                    state={stepState}
                    error={errors[fieldName]?.message}
                    onAdvance={() => void advanceStep(fieldName)}
                  />

                  {stepState === 'locked' && (
                    <button
                      type="button"
                      onClick={() => goToStep(index)}
                      aria-label={`Edit ${fieldName}`}
                      className="absolute right-2 top-2 flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-white/50 opacity-0 transition-opacity hover:border-[#00D4FF]/30 hover:text-[#00D4FF] focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <LuPencil className="h-3 w-3" aria-hidden />
                      edit
                    </button>
                  )}
                </div>
              )}
            />
          );
        })}
      </div>

      {isReadyToSend && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            variant="outline"
            color="primary"
            disabled={status === 'sending' || isSubmitting}
            className="gap-2 border-[#00D4FF]/30 bg-[#00D4FF]/10 font-mono text-[#00D4FF] hover:bg-[#00D4FF]/15"
          >
            {status === 'sending' || isSubmitting ? (
              <LuLoader className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LuSend className="h-4 w-4" aria-hidden />
            )}
            $ send_message
          </Button>

          <p role="status" aria-live="polite" className="text-xs">
            {status === 'error' && (
              <span className="flex items-center gap-1.5 text-[#FF5F56]">
                <LuCircleAlert className="h-3.5 w-3.5" aria-hidden />
                {statusMessage}
              </span>
            )}
          </p>
        </div>
      )}
    </form>
  );
}
