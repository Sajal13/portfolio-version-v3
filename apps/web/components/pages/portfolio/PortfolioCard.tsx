import Image from 'next/image';
import { FiExternalLink, FiArrowRight } from '@repo/icons/fi';
import { Portfolio } from '@repo/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@repo/ui/components';
import { ToolBadge } from './ToolBadge';

export function PortfolioCard({
  project,
  width
}: {
  project: Portfolio;
  width: number;
}) {
  return (
    <Card className="group shrink-0 overflow-hidden" style={{ width }}>
      <div className="px-6">
        <div className="relative aspect-video overflow-hidden rounded-md border border-white/5 bg-secondary-800">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={`${width}px`}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <span className="truncate">{project.title}</span>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live site`}
              className="shrink-0 text-neutral-400 transition-colors hover:text-primary-400"
            >
              <FiExternalLink className="size-4" />
            </a>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      {project.tools?.length > 0 && (
        <CardContent className="flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <ToolBadge key={tool.id} tool={tool} />
          ))}
        </CardContent>
      )}

      {project.githubLink && (
        <CardFooter>
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-tertiary-400 transition-colors hover:text-tertiary-300"
          >
            explore_resources <FiArrowRight className="size-3" />
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
