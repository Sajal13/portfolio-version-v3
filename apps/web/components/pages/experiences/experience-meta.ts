// src/features/experience/experience-meta.ts
import type { IconType } from '@repo/icons';
import { FaBriefcase, FaClock, FaGraduationCap } from '@repo/icons/fa';
import { ExperienceType } from '@repo/types';
import type { BadgeProps } from '@repo/ui/components';

export const experienceTypeIcon: Record<ExperienceType, IconType> = {
  [ExperienceType.fullTime]: FaBriefcase,
  [ExperienceType.partTime]: FaClock,
  [ExperienceType.education]: FaGraduationCap
};

export const experienceTypeLabel: Record<ExperienceType, string> = {
  [ExperienceType.fullTime]: 'Full-time',
  [ExperienceType.partTime]: 'Part-time',
  [ExperienceType.education]: 'Education'
};

// maps to your Badge's `color` variant so the type chip matches the
// design system instead of hand-rolled accent classes
export const experienceTypeBadgeColor: Record<
  ExperienceType,
  NonNullable<BadgeProps['color']>
> = {
  [ExperienceType.fullTime]: 'info',
  [ExperienceType.partTime]: 'warning',
  [ExperienceType.education]: 'secondary'
};
