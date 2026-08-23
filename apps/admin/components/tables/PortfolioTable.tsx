import { LuEye } from '@repo/icons/lu';
import { MdDelete } from '@repo/icons/md';
import { VscEdit } from '@repo/icons/vsc';
import { Portfolio } from '@repo/types';
import { Badge, Button } from '@repo/ui/components';
import { textTrimmer } from '@repo/ui/utils';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import dayjs from 'dayjs';

const formatMonthYear = (date?: string) =>
  date && dayjs(date).isValid() ? dayjs(date).format('MMM YYYY') : undefined;

export const portfolioTableColumn = (): ColumnDef<Portfolio>[] => [
  {
    accessorKey: 'image',
    header: 'Cover',
    cell: ({ row: { original } }) =>
      original.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={original.image}
          alt={original.title}
          className="size-10 rounded object-cover"
        />
      ) : (
        <span className="text-secondary-300">-</span>
      ),
    meta: { cellProps: { className: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row: { original } }) => (
      <span>{textTrimmer(original.title, 20) ?? ''}</span>
    ),
    meta: {
      headerProps: { className: 'text-start' },
      cellProps: { className: 'whitespace-nowrap' }
    }
  },
  {
    accessorKey: 'projectType',
    header: 'Type',
    cell: ({ row: { original } }) => (
      <Badge color="primary">{original.projectType}</Badge>
    ),
    meta: {
      headerProps: { className: 'text-start' },
      cellProps: { className: 'whitespace-nowrap' }
    }
  },
  {
    accessorKey: 'publishedDate',
    header: 'Published',
    cell: ({ row: { original } }) => (
      <span className="whitespace-nowrap">
        {formatMonthYear(original.publishedDate) ?? '-'}
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
    accessorKey: 'order',
    header: 'Order',
    meta: {
      cellProps: {
        className: 'text-center'
      }
    }
  }
];

interface PortfolioTableProps {
  isLoading?: boolean;
  className?: string;
  data: Portfolio[];
  onReorder: (items: Portfolio[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const PortfolioTable = ({
  className,
  isLoading,
  data,
  onReorder,
  onEdit,
  onView,
  onDelete
}: PortfolioTableProps) => {
  return (
    <div className={className}>
      <AdvanceTable<Portfolio>
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

export default PortfolioTable;
