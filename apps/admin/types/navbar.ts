import type { IconType } from '@repo/icons';

export type AdminRoute = {
  label: string;
  path: string;
  icon: IconType;
  active?: boolean;
};
