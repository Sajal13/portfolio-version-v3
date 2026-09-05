import type { IconType } from '@repo/icons';
import { LuGithub, LuLinkedin, LuMail, LuTwitter } from '@repo/icons/lu';
import type { StepField } from './contact.schema';

export const BOOT_LINES = [
  '$ ./contact --secure --init',
  '> Establishing encrypted channel...',
  '> Protocol: TLS 1.3 / AES-256-GCM',
  '> Identity verified.',
  '> Connection ready. Begin transmission.'
];

export const MIN_FILL_TIME_MS = 2500;

// Order the step-by-step reveal happens in.
export const STEP_ORDER: StepField[] = ['name', 'email', 'message'];

export const STEP_META: Record<
  StepField,
  { label: string; prompt: string; as: 'input' | 'textarea' }
> = {
  name: { label: 'your name:', prompt: 'type your name...', as: 'input' },
  email: { label: 'your email:', prompt: 'you@example.com', as: 'input' },
  message: {
    label: 'your message:',
    prompt: 'what are we building...',
    as: 'textarea'
  }
};

type Social = { label: string; href: string; icon: IconType };

export const SOCIALS: Social[] = [
  { label: 'GitHub', href: 'https://github.com/nexusdev', icon: LuGithub },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/nexus',
    icon: LuLinkedin
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/nexus_architect',
    icon: LuTwitter
  },
  { label: 'Email', href: 'mailto:dev@portfolio.io', icon: LuMail }
];
