import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import type { Argument } from 'classnames';

/**
 * Reuses your existing
 * classnames + tailwind-merge deps, no new packages needed for this part.
 */
export function cn(...inputs: Argument[]) {
  return twMerge(classNames(inputs));
}
