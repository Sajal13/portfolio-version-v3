// src/features/experience/experience-card.tsx
'use client';

import { Experience } from '@repo/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  Badge
} from '@repo/ui/components';
import { cn } from '@repo/ui/utils';
import dayjs from 'dayjs';
import {
  experienceTypeBadgeColor,
  experienceTypeIcon,
  experienceTypeLabel
} from './experience-meta';

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const ExperienceCard = ({
  experience,
  className,
  ref
}: ExperienceCardProps) => {
  const Icon = experienceTypeIcon[experience.experienceType];

  // "ongoing" is derived from endDate, NOT status. `status` only controls
  // whether the entry is published/shown at all (see buildTimelineEntries) —
  // it says nothing about whether the role itself is still current.
  const isCurrent = experience.endDate === null;

  const dateRange = `${dayjs(experience.startDate).format('YYYY')} — ${
    isCurrent ? 'PRESENT' : dayjs(experience.endDate).format('YYYY')
  }`;

  return (
    <Card
      ref={ref}
      className={cn(
        'border-white/10 bg-white/3 py-5 backdrop-blur-sm',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg text-white">{experience.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {experience.company}
          {experience.location ? ` · ${experience.location}` : ''}
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <span className="font-mono text-xs text-neutral-500">
            {dateRange}
          </span>
          {isCurrent && (
            <Badge color="success" className="items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              LIVE
            </Badge>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-neutral-400">
          {experience.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="filled"
            color={experienceTypeBadgeColor[experience.experienceType]}
          >
            {experienceTypeLabel[experience.experienceType]}
          </Badge>

          {experience.tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Badge variant="outline" color="neutral" className="gap-1.5">
                {tool.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tool.icon} alt="" className="h-3 w-3 shrink-0" />
                )}
                {tool.name}
              </Badge>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
