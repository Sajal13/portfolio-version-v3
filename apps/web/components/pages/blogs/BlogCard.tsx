import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiExternalLink } from '@repo/icons/fi';
import { Blog } from '@repo/types';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@repo/ui/components';

interface BlogCardProps {
  blog: Blog;
  width: number;
}

export function BlogCard({ blog, width }: BlogCardProps) {
  return (
    <Card className="group shrink-0 overflow-hidden" style={{ width }}>
      <div className="px-6">
        <div className="relative aspect-video overflow-hidden rounded-md border border-white/5 bg-secondary-800">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes={`${width}px`}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <span className="truncate">{blog.title}</span>
          {blog.slug && (
            <Link
              href={`/blogs/${blog.slug}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${blog.title} read`}
              className="shrink-0 text-neutral-400 transition-colors hover:text-primary-400"
            >
              <FiExternalLink className="size-4" />
            </Link>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {blog.description}
        </CardDescription>
      </CardHeader>

      {blog.tools?.length > 0 && (
        <CardContent className="flex flex-wrap gap-2">
          {blog.tools.map((tool) => (
            <Badge key={tool.id} color="secondary">
              {tool.name}
            </Badge>
          ))}
        </CardContent>
      )}

      {blog.slug && (
        <CardFooter>
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-tertiary-400 transition-colors hover:text-tertiary-300"
          >
            explore_resources <FiArrowRight className="size-3" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
