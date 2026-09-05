import Image from 'next/image';
import type { ToolSummary } from '@repo/types';

export const ToolBadge = ({ tool }: { tool: ToolSummary }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-secondary-800 px-2 py-1 text-[11px] text-neutral-300">
      {tool.icon && (
        <Image
          src={tool.icon}
          alt=""
          width={14}
          height={14}
          className="rounded-sm"
          unoptimized
        />
      )}
      {tool.name}
    </span>
  );
};
