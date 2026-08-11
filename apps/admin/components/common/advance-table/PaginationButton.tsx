import React, { ComponentProps, PropsWithChildren } from 'react';
import classNames from 'classnames';

type Button = ComponentProps<'button'> & {
  active?: boolean;
  className?: string;
};

const PaginationButton = ({
  active,
  className,
  children,
  ...rest
}: PropsWithChildren<Button>) => {
  return (
    <button
      className={classNames(
        'border p-2 rounded-lg min-w-8 min-h-8 leading-none cursor-pointer',
        ' transition-all duration-300 ease-linear',
        {
          'bg-primary-500 border-primary-500 hover:bg-primary-hover hover:border-primary-hover':
            active,
          'bg-secondary-700 border-pagination hover:bg-neutral-200 text-white hover:text-neutral-900':
            !active
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
