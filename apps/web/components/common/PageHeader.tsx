import React, { PropsWithChildren } from 'react';
import { cn } from '@repo/ui/utils';

interface PageHeaderProps {
  eyebrow?: string;
  heading?: string;
  eyebrowClassName?: string;
  headingClassName?: string;
  index?: string;
  hasNavigation?: boolean;
  className?: string;
}

const PageHeader = ({
  eyebrow = '// digital monuments',
  heading = 'Featured Works',
  eyebrowClassName,
  headingClassName,
  index,
  className,
  hasNavigation,
  children
}: PropsWithChildren<PageHeaderProps>) => {
  return (
    <div
      className={cn('mb-10 flex items-end justify-between gap-6', className)}
    >
      <div>
        <p
          className={cn(
            'mb-2 font-mono text-sm md:text-base text-info-400',
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
        <h2
          className={cn(
            'text-3xl font-bold text-white sm:text-4xl md:text-5xl text-nowrap',
            headingClassName
          )}
        >
          {heading}
        </h2>
      </div>

      <div
        className={cn(
          'flex items-center gap-4',
          hasNavigation ? 'flex-col md:flex-row items-end' : ''
        )}
      >
        {index && (
          <span className="font-mono text-sm text-neutral-500">({index})</span>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
