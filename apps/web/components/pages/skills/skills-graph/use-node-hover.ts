import { useCallback, useState } from 'react';
import { round } from './round';
import type { LeafNode } from './types';

export type HoverPosition = { x: number; y: number; containerWidth: number };

export const useNodeHover = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [hovered, setHovered] = useState<LeafNode | null>(null);
  const [hoverPos, setHoverPos] = useState<HoverPosition | null>(null);

  const handleEnter = useCallback(
    (node: LeafNode, e: React.MouseEvent<SVGGElement>) => {
      setHovered(node);
      const containerRect = containerRef.current?.getBoundingClientRect();
      const targetRect = e.currentTarget.getBoundingClientRect();
      if (containerRect) {
        setHoverPos({
          x: round(targetRect.left + targetRect.width / 2 - containerRect.left),
          y: round(targetRect.bottom - containerRect.top),
          containerWidth: containerRect.width
        });
      }
    },
    [containerRef]
  );

  const handleLeave = useCallback(() => {
    setHovered(null);
    setHoverPos(null);
  }, []);

  return { hovered, hoverPos, handleEnter, handleLeave };
};
