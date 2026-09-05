import { PaletteColor } from '../constants';
import { labelBelow } from '../label-utils';
import type { CategoryNode } from '../types';

export const CategoryNodes = ({
  nodes,
  isDimmed
}: {
  nodes: CategoryNode[];
  isDimmed: (color: PaletteColor) => boolean;
}) => {
  return (
    <>
      {nodes.map((c) => {
        const lp = labelBelow(c.x, c.y, 22 + 14);
        const faded = isDimmed(c.color);
        return (
          <g key={c.id} className="node-enter" opacity={faded ? 0.15 : 1}>
            <circle
              cx={c.x}
              cy={c.y}
              r={22}
              fill="#0F1620"
              stroke={c.color.stroke}
              strokeWidth={1.5}
            />
            <text
              x={c.x}
              y={c.y + 4}
              textAnchor="middle"
              className="text-[9px] fill-white/80 font-semibold pointer-events-none"
            >
              {c.count}
            </text>
            <text
              {...lp}
              dominantBaseline="hanging"
              className="text-[11px] font-semibold uppercase tracking-wide"
              fill={c.color.stroke}
            >
              {c.title}
            </text>
          </g>
        );
      })}
    </>
  );
};
