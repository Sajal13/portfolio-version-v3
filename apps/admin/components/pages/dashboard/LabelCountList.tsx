import { LabelCount } from '@repo/types';
import { Progress } from '@repo/ui/components';

interface LabelCountListProps {
  data: LabelCount[];
  emptyLabel?: string;
}

const LabelCountList = ({
  data,
  emptyLabel = 'No data yet.'
}: LabelCountListProps) => {
  if (!data.length) {
    return (
      <p className="py-6 text-center text-sm text-neutral-400">{emptyLabel}</p>
    );
  }

  const max = data[0]?.count ?? 1;

  return (
    <ul className="flex flex-col gap-3">
      {data.map((item) => (
        <li key={item.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-neutral-200" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 font-medium text-neutral-100">
              {item.count.toLocaleString()}
            </span>
          </div>
          <Progress
            value={(item.count / max) * 100}
            color="primary"
            className="h-1.5"
          />
        </li>
      ))}
    </ul>
  );
};

export default LabelCountList;
