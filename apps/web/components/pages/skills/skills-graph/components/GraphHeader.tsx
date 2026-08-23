import { Button } from '@repo/ui/components';
import type { CategoryNode } from '../types';

export function GraphHeader({
  categories,
  onHoverCategory
}: {
  categories: CategoryNode[];
  onHoverCategory: (name: string | null) => void;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-linear-to-b from-[#0A0E12] to-transparent pointer-events-none">
      <div className="flex items-center gap-2 text-[11px] tracking-widest text-white/40 uppercase pointer-events-auto">
        <span className="text-[#5EEAD4]">&gt;_</span> skills --graph
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 pointer-events-auto">
        {categories.map((c) => (
          <Button
            variant="link"
            color="white"
            key={c.id}
            onMouseEnter={() => onHoverCategory(c.color.name)}
            onMouseLeave={() => onHoverCategory(null)}
            className="gap-1.5 text-[11px] transition-colors"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: c.color.stroke }}
            />
            {c.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
