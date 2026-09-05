'use client';

import { useCallback, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaCheckCircle } from '@repo/icons/fa';
import { LuCircleAlert, LuLoader, LuSend } from '@repo/icons/lu';
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
      mountedAtRef.current = Date.now();
      setActiveStep(0); // back to step one for a fresh submission
    } catch {
      setStatus('error');
      setStatusMessage(
        'Transmission failed. Please try again or email me directly.'
      );
    }
  };

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
        {STEP_ORDER.map((fieldName, index) => (
          <Controller
            key={fieldName}
            control={control}
            name={fieldName}
            render={({ field }) => (
              <TerminalStepField
                {...field}
                meta={STEP_META[fieldName]}
                state={
                  index < activeStep
                    ? 'locked'
                    : index === activeStep
                      ? 'active'
                      : 'pending'
                }
                error={errors[fieldName]?.message}
                onAdvance={() => void advanceStep(fieldName)}
              />
            )}
          />
        ))}
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
            {status === 'success' && (
              <span className="flex items-center gap-1.5 text-[#27C93F]">
                <FaCheckCircle className="h-3.5 w-3.5" aria-hidden />
                {statusMessage}
              </span>
            )}
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
