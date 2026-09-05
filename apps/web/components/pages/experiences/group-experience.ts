// src/features/experience/group-experiences.ts
import { Experience, ExperienceStatus, ExperienceType } from '@repo/types';

export interface TimelineEntry {
  experience: Experience;
  groupType: ExperienceType;
  isGroupStart: boolean;
  isGroupEnd: boolean;
}

/**
 * - keeps only Active experiences
 * - sorts by `order`
 * - batches consecutive same-type experiences into a "group" so the UI
 *   can render a single type divider/label instead of repeating it per card
 */
export function buildTimelineEntries(
  experiences: Experience[]
): TimelineEntry[] {
  const sorted = [...experiences]
    .filter((exp) => exp.status === ExperienceStatus.active)
    .sort((a, b) => a.order - b.order);

  const entries: TimelineEntry[] = sorted.map((experience, i) => {
    const prev = sorted[i - 1];
    const next = sorted[i + 1];
    return {
      experience,
      groupType: experience.experienceType,
      isGroupStart: !prev || prev.experienceType !== experience.experienceType,
      isGroupEnd: !next || next.experienceType !== experience.experienceType
    };
  });

  return entries;
}
