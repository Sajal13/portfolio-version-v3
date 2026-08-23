import { textFormatter } from '@repo/ui/utils';
import type { LeafNode } from '../types';
import type { HoverPosition } from '../use-node-hover';

const TOOLTIP_WIDTH = 160; // matches min-w-40

export function GraphTooltip({
  node,
  position
}: {
  node: LeafNode;
  position: HoverPosition;
}) {
  const clampedX = Math.min(
    Math.max(position.x, TOOLTIP_WIDTH / 2 + 8),
    position.containerWidth - TOOLTIP_WIDTH / 2 - 8
  );

  return (
    <div
      className="absolute z-10 bg-[#0F1620] border border-white/10 rounded px-3 py-2 text-xs text-white/80 pointer-events-none min-w-40"
      style={{
        left: clampedX,
        top: position.y + 8,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="font-semibold text-white mb-1">{node.title?.name}</div>
      <div className="text-white/40 capitalize">
        {node.category}
        {node.hubParent ? ` / ${textFormatter(node.hubParent)}` : ''}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${node.progress}%`,
              backgroundColor: node.color.stroke
            }}
          />
        </div>
        <span style={{ color: node.color.stroke }}>{node.progress}%</span>
      </div>
      {!node.isActive && (
        <div className="mt-1 text-[10px] text-white/30">not actively used</div>
      )}
    </div>
  );
}
