'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast, InputOTP, Modal } from '@repo/ui/components';

const OTP_DURATION_SECONDS = 180; // 3 minutes — keep in sync with the backend's preAuthToken/otp expiry

type OtpModalProps = {
  isOpen: boolean;
  preAuthToken: string;
  onClose: () => void;
};

export function OtpModal({ isOpen, preAuthToken, onClose }: OtpModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [otpKey, setOtpKey] = useState(0); // bump to remount InputOTP and clear it after a failed attempt
  const expiredHandled = useRef(false);
  const { toast } = useToast();
  const router = useRouter();

  // Countdown timer — resets whenever the modal opens for a fresh attempt.
  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(OTP_DURATION_SECONDS);
    expiredHandled.current = false;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Fires once when the countdown hits zero.
  useEffect(() => {
    if (isOpen && secondsLeft === 0 && !expiredHandled.current) {
      expiredHandled.current = true;
      toast({
        title: 'Login verification failed',
        description: 'Your code expired. Please log in again.',
        variant: 'error'
      });
      onClose();
    }
  }, [secondsLeft, isOpen, onClose, toast]);

  const handleComplete = async (otp: string) => {
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preAuthToken, otp })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast({
          title: 'Login verification failed',
          description: body?.message ?? 'The code you entered is incorrect.',
          variant: 'error'
        });
        setOtpKey((k) => k + 1);
        return;
      }

      onClose();
      router.push('/dashboard');
    } catch {
      toast({
        title: 'Login verification failed',
        description: 'Something went wrong. Please try again.',
        variant: 'error'
      });
      setOtpKey((k) => k + 1);
    } finally {
      setVerifying(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content className="max-w-md">
        <Modal.Header>
          Verify it's you
          <Modal.Close aria-label="Close">×</Modal.Close>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-neutral-400">
            Enter the 6-digit code we emailed you. It expires in{' '}
            <span className="font-medium text-white">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </p>
          <InputOTP
            key={otpKey}
            length={6}
            disabled={verifying || secondsLeft === 0}
            onComplete={handleComplete}
          />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
