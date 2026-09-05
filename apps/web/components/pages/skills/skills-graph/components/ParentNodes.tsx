import { textFormatter } from '@repo/ui/utils';
import { PaletteColor } from '../constants';
import { labelBelow } from '../label-utils';
import type { ParentNode } from '../types';

export const ParentNodes = ({
  nodes,
  isDimmed
}: {
  nodes: ParentNode[];
  isDimmed: (color: PaletteColor) => boolean;
}) => {
  return (
    <>
      {nodes.map((p) => {
        const faded = isDimmed(p.color);
        const lp = labelBelow(p.x, p.y, 4 + 10);
        return (
          <g key={p.id} className="node-enter" opacity={faded ? 0.12 : 0.85}>
            <circle cx={p.x} cy={p.y} r={4} fill={p.color.stroke} />
            <text
              {...lp}
              dominantBaseline="hanging"
              className="text-[9px] fill-white/45 italic capitalize block"
            >
              {textFormatter(p.title)}
            </text>
          </g>
        );
      })}
    </>
  );
};
