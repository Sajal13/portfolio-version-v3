import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageHeaderProps {
  title: string;
  className?: string;
  titleClassName?: string;
}

const PageHeader = ({
  title,
  className,
  titleClassName,
  children
}: PropsWithChildren<PageHeaderProps>) => {
  return (
    <div
      className={twMerge(
        'flex flex-wrap justify-between items-center gap-4 mb-5 md:mb-7.5',
        className
      )}
    >
      <h1 className={titleClassName}>{title}</h1>
      {children}
    </div>
  );
};

export default PageHeader;
