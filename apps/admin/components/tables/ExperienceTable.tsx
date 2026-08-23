import { LuEye } from '@repo/icons/lu';
import { MdDelete } from '@repo/icons/md';
import { VscEdit } from '@repo/icons/vsc';
import { Experience, ExperienceStatus } from '@repo/types';
import { Badge, Button } from '@repo/ui/components';
import { textTrimmer } from '@repo/ui/utils';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import dayjs from 'dayjs';

const experienceTypeLabel: Record<string, string> = {
  Education: 'Education',
  FullTime: 'Full Time',
  PartTime: 'Part Time'
};

const formatMonthYear = (date?: string) =>
  date && dayjs(date).isValid() ? dayjs(date).format('MMM YYYY') : undefined;

export const experienceTableColumn = (): ColumnDef<Experience>[] => [
  {
    accessorKey: 'experienceType',
    header: 'Type',
    cell: ({ row: { original } }) => (
      <Badge color="primary">
        {experienceTypeLabel[original.experienceType] ??
          original.experienceType}
      </Badge>
    ),
    meta: {
      headerProps: { className: 'text-start' },
      cellProps: { className: 'whitespace-nowrap' }
    }
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row: { original } }) => (
      <span>{original.title ? textTrimmer(original.title, 15) : ''}</span>
    ),
    meta: {
      headerProps: { className: 'text-start' },
      cellProps: { className: 'whitespace-nowrap' }
    }
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row: { original } }) => (
      <span>{original.company ? textTrimmer(original.company, 15) : ''}</span>
    ),
    meta: { cellProps: { className: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'location',
    header: 'Location',
    meta: { cellProps: { className: 'whitespace-nowrap' } }
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: ({ row: { original } }) => (
      <span className="whitespace-nowrap">
        {formatMonthYear(original.startDate) ?? '-'} —{' '}
        {formatMonthYear(original.endDate) ?? 'Present'}
      </span>
    )
  },
  {
    accessorKey: 'tools',
    header: 'Tools',
    cell: ({ row: { original } }) => (
      <div className="flex flex-wrap gap-1.5 max-w-60">
        {original.tools?.map((tool) => (
          <Badge key={tool.id} color="secondary">
            {tool.name}
          </Badge>
        ))}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row: { original } }) => (
      <Badge
        color={
          original.status === ExperienceStatus.active ? 'success' : 'error'
        }
      >
        {original.status === ExperienceStatus.active ? 'Active' : 'Inactive'}
      </Badge>
    ),
    meta: { cellProps: { className: 'text-center' } }
  },
  {
    accessorKey: 'order',
    header: 'Order',
    meta: {
      cellProps: {
        className: 'text-center'
      }
    }
  }
];

interface ExperienceTableProps {
  isLoading?: boolean;
  className?: string;
  data: Experience[];
  onReorder: (items: Experience[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ExperienceTable = ({
  className,
  isLoading,
  data,
  onReorder,
  onEdit,
  onView,
  onDelete
}: ExperienceTableProps) => {
  return (
    <div className={className}>
      <AdvanceTable<Experience>
        headerCellClassName="border-b border-b-base"
        cellClassName="border-b border-b-base"
        isLoading={isLoading}
        data={data}
        onReorder={onReorder}
        renderRowActions={(row) => (
          <div className="flex justify-center items-center gap-3">
            <Button
              variant="outline"
              color="primary"
              size="sm"
              className="px-2"
              onClick={() => onEdit(row.id)}
            >
              <VscEdit className="size-4" />
            </Button>
            <Button
              variant="filled"
              color="success"
              size="sm"
              className="px-2"
              onClick={() => onView(row.id)}
            >
              <LuEye className="size-4" />
            </Button>
            <Button
              variant="filled"
              color="error"
              size="sm"
              className="px-2"
              onClick={() => onDelete(row.id)}
            >
              <MdDelete className="size-4" />
            </Button>
          </div>
        )}
      />
      {!isLoading && (
        <AdvanceTablePagination className="my-10 md:my-12.5 px-7 md:px-8.5" />
      )}
    </div>
  );
};

export default ExperienceTable;
