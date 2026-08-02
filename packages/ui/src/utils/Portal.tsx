'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children into document.body (or a given container) instead of
 * their normal place in the tree — needed so overlay content (dialogs,
 * dropdowns, tooltips) isn't clipped by a parent's `overflow: hidden` or
 * stacking context.
 *
 * `mounted` is initialized lazily so it's already `true` on the client's
 * first render (no extra effect-driven tick before the portal target
 * exists) — this matters because consumers like DropdownMenu measure
 * `floatingRef.current` synchronously in a `useLayoutEffect` on open,
 * and need the portaled node to already be in the DOM by then.
 */
function Portal({
  children,
  container
}: {
  children: React.ReactNode;
  container?: Element | null;
}) {
  const [mounted, setMounted] = React.useState(
    () => typeof document !== 'undefined'
  );

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}

export { Portal };
