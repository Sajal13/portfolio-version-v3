import type { PaletteColor } from '../constants';
import { Link } from '../types';

export function GraphLinks({
  links,
  isDimmed
}: {
  links: Link[];
  isDimmed: (color: PaletteColor) => boolean;
}) {
  return (
    <>
      {links.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.color.stroke}
          strokeOpacity={isDimmed(l.color) ? 0.08 : 0.28}
          strokeWidth={1}
          className="flow-line"
        />
      ))}
    </>
  );
}
