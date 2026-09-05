import { textFormatter } from '@repo/ui/utils';
import type { LeafNode } from '../types';
import type { HoverPosition } from '../use-node-hover';

const TOOLTIP_WIDTH = 160; // matches min-w-40

export const GraphTooltip = ({
  node,
  position
}: {
  node: LeafNode;
  position: HoverPosition;
}) => {
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
      <div className="flex items-center gap-2 mb-1">
        {node.title?.icon && (
          <img
            src={node.title.icon}
            alt=""
            className="w-5 h-5 rounded object-cover border border-white/10 shrink-0"
          />
        )}
        <div className="font-semibold text-white leading-tight">
          {node.title?.name}
        </div>
      </div>

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

      {node.title?.docUrl && (
        <a
          href={node.title.docUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#5EEAD4] hover:underline pointer-events-auto"
        >
          view docs ↗
        </a>
      )}
    </div>
  );
};
