'use client';

/* Requires ../skills-graph.css to be imported once, globally
   (it registers the `flow-line` and `node-enter` utilities). */
import { useMemo, useRef, useState } from 'react';
import type { Skill } from '@repo/types';
import { cn } from '@repo/ui/utils';
import { buildLayout } from './skills-graph/build-layout';
import { CategoryNodes } from './skills-graph/components/CategoryNodes';
import { CenterHub } from './skills-graph/components/CenterHub';
import { GraphControls } from './skills-graph/components/GraphControls';
import { GraphHeader } from './skills-graph/components/GraphHeader';
import { GraphLinks } from './skills-graph/components/GraphLinks';
import { GraphTooltip } from './skills-graph/components/GraphTooltip';
import { LeafNodes } from './skills-graph/components/LeafNodes';
import { ParentNodes } from './skills-graph/components/ParentNodes';
import { VIEWBOX } from './skills-graph/constants';
import type { PaletteColor } from './skills-graph/constants';
import { useNodeHover } from './skills-graph/use-node-hover';
import { usePanZoom } from './skills-graph/use-pan-zoom';

export default function SkillsGraph({ skills }: { skills: Skill[] }) {
  const layout = useMemo(
    () => (skills?.length ? buildLayout(skills) : null),
    [skills]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const {
    view,
    zoomBy,
    resetView,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel
  } = usePanZoom();
  const { hovered, hoverPos, handleEnter, handleLeave } =
    useNodeHover(containerRef);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const isDimmed = (color?: PaletteColor) =>
    Boolean(activeCategory) && color?.name !== activeCategory;

  const shellClass =
    'relative w-full h-[640px] bg-[#0A0E12] rounded-lg overflow-hidden border border-white/10 select-none font-mono';

  if (!layout) {
    return (
      <div className={shellClass}>
        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs font-mono">
          no skills to display
        </div>
      </div>
    );
  }

  return (
    <div
      id="capabilities"
      ref={containerRef}
      className={cn(shellClass, 'touch-none')}
    >
      <GraphHeader
        categories={layout.categoryNodes}
        onHoverCategory={setActiveCategory}
      />
      <GraphControls
        onZoomIn={() => zoomBy(1.15)}
        onZoomOut={() => zoomBy(0.87)}
        onReset={resetView}
      />

      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        <g
          transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}
          style={{ transformOrigin: 'center' }}
        >
          <GraphLinks links={layout.links} isDimmed={isDimmed} />
          <CenterHub total={skills.length} />
          <CategoryNodes nodes={layout.categoryNodes} isDimmed={isDimmed} />
          <ParentNodes nodes={layout.parentNodes} isDimmed={isDimmed} />
          <LeafNodes
            nodes={layout.leafNodes}
            hoveredId={hovered?.id ?? null}
            isDimmed={isDimmed}
            onEnter={handleEnter}
            onLeave={handleLeave}
          />
        </g>
      </svg>

      {hovered && hoverPos && (
        <GraphTooltip node={hovered} position={hoverPos} />
      )}
    </div>
  );
}
