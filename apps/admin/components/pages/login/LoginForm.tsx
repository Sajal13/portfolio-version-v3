'use client';

import { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@repo/api-client';
import { FaEnvelope, FaLock, FaArrowRight } from '@repo/icons/fa';
import { Button, Checkbox, Input } from '@repo/ui/components';
import { useToast } from '@repo/ui/components';
import { ApiEnvelope } from 'lib/api-types';
import { getErrorMessage } from 'lib/error';
import { useForm } from 'react-hook-form';
import {
  LoginFormSchema,
  type LoginFormSchemaType
} from 'utils/schemas/LoginSchema';
import { OtpModal } from './OtpModal';

type LoginResponse = {
  otpRequired: boolean;
  preAuthToken: string;
};

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (values: LoginFormSchemaType) => {
    setSubmitting(true);
    try {
      const res = await api.post<ApiEnvelope<LoginResponse>>(
        '/api/auth/login',
        {
          email: values.email,
          password: values.password,
          rememberMe: remember // backend field is rememberMe, not remember
        }
      );
      if (res.data.otpRequired && res.data.preAuthToken) {
        setPreAuthToken(res.data.preAuthToken);
        setOtpModalOpen(true);
      }
    } catch (err) {
      toast({
        title: 'Login failed',
        description: getErrorMessage(err),
        variant: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-secondary-900">
        {/* Full-bleed background photo */}
        <Image
          src="/assets/image/background.webp"
          alt=""
          fill
          priority
          className="object-cover object-right"
        />

        {/* Darken the left side so the form stays legible over the photo */}
        <div className="absolute inset-0 bg-linear-to-r from-secondary-900 via-secondary-900/80 to-secondary-900/10" />

        {/* Form panel */}
        <div className="relative z-10 flex w-full max-w-xl flex-col justify-center px-10 py-16 sm:px-16">
          <Image
            src="/assets/image/logo.webp"
            alt="Sajal Das"
            width={56}
            height={56}
            className="mb-8"
          />

          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Welcome <span className="text-primary-500">Back</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Let&apos;s build something amazing today.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-neutral-300">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                size="lg"
                placeholder="your.email@example.com"
                icon={<FaEnvelope className="size-4" />}
                aria-invalid={!!errors.email}
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-error-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-neutral-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                size="lg"
                placeholder="••••••••"
                icon={<FaLock className="size-4" />}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-error-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300">
                <Checkbox checked={remember} onCheckedChange={setRemember} />
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              variant="filled"
              color="primary"
              size="lg"
              disabled={submitting}
              className="mt-2"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
              <FaArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-10 text-xs text-neutral-500">
            © {new Date().getFullYear()} Sajal Das. All rights reserved.
          </p>
        </div>
      </div>

      <OtpModal
        isOpen={otpModalOpen}
        preAuthToken={preAuthToken}
        onClose={() => setOtpModalOpen(false)}
      />
    </>
  );
}
