'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children into document.body (or a given container) instead of
 * their normal place in the tree — needed so overlay content (dialogs,
 * dropdowns, tooltips) isn't clipped by a parent's `overflow: hidden` or
 * stacking context.
 *
 * The `mounted` check exists because createPortal needs a real DOM node,
 * which doesn't exist during server-side rendering.
 */
function Portal({
  children,
  container
}: {
  children: React.ReactNode;
  container?: Element | null;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}

export { Portal };
