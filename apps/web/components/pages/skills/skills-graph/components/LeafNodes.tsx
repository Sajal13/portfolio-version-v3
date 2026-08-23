import type { PaletteColor } from '../constants';
import { labelBelow } from '../label-utils';
import type { LeafNode } from '../types';

export function LeafNodes({
  nodes,
  hoveredId,
  isDimmed,
  onEnter,
  onLeave
}: {
  nodes: LeafNode[];
  hoveredId: LeafNode['id'] | null;
  isDimmed: (color: PaletteColor) => boolean;
  onEnter: (node: LeafNode, e: React.MouseEvent<SVGGElement>) => void;
  onLeave: () => void;
}) {
  return (
    <>
      {nodes.map((s) => {
        const faded = isDimmed(s.color);
        const r = 15;
        const circumference = 2 * Math.PI * r;
        const dash = (s.progress / 100) * circumference;
        const lp = labelBelow(s.x, s.y, r + 12);
        const isHovered = hoveredId === s.id;
        return (
          <g
            key={s.id}
            className="node-enter cursor-pointer"
            opacity={faded ? 0.15 : 1}
            onMouseEnter={(e) => onEnter(s, e)}
            onMouseLeave={onLeave}
          >
            <circle
              cx={s.x}
              cy={s.y}
              r={r}
              fill="#0F1620"
              stroke={s.color.dim}
              strokeWidth={3}
            />
            <circle
              cx={s.x}
              cy={s.y}
              r={r}
              fill="none"
              stroke={s.color.stroke}
              strokeWidth={3}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={circumference / 4}
              transform={`rotate(-90 ${s.x} ${s.y})`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            {!s.isActive && (
              <circle cx={s.x} cy={s.y} r={2} fill="white" opacity={0.35} />
            )}
            {isHovered && (
              <circle
                cx={s.x}
                cy={s.y}
                r={r + 5}
                fill="none"
                stroke={s.color.stroke}
                strokeWidth={1}
                opacity={0.5}
              />
            )}
            <text
              {...lp}
              dominantBaseline="hanging"
              className={`text-[10px] ${isHovered ? 'fill-white' : 'fill-white/70'}`}
            >
              {s.title?.name}
            </text>
          </g>
        );
      })}
    </>
  );
}
