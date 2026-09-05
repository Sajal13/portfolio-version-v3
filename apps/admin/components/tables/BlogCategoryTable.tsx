import { MdDelete } from '@repo/icons/md';
import { VscEdit } from '@repo/icons/vsc';
import { BlogCategory } from '@repo/types';
import { Button } from '@repo/ui/components';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import dayjs from 'dayjs';

export const blogCategoryTableColumns = (
  onEdit: (row: number) => void,
  onDelete: (row: number) => void
): ColumnDef<BlogCategory>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      headerProps: {
        className: 'min-w-40 text-start'
      },
      cellProps: {
        className: 'font-medium whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    meta: {
      cellProps: {
        className: 'font-medium whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row: { original } }) => {
      const { createdAt } = original;

      return <span>{dayjs(createdAt).format('MMM DD, YYYY')}</span>;
    },
    meta: {
      headerProps: {
        className: 'whitespace-nowrap'
      },
      cellProps: {
        className: 'font-medium whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row: { original } }) => {
      const { updatedAt } = original;

      return <span>{dayjs(updatedAt).format('MMM DD, YYYY')}</span>;
    },
    meta: {
      cellProps: {
        className: 'font-medium whitespace-nowrap text-center'
      }
    }
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row: { original } }) => {
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            color="primary"
            size="sm"
            className="px-2"
            onClick={() => onEdit(original.id)}
          >
            <VscEdit className="size-4" />
          </Button>
          <Button
            variant="filled"
            color="error"
            size="sm"
            className="px-2"
            onClick={() => onDelete(original.id)}
          >
            <MdDelete className="size-4" />
          </Button>
        </div>
      );
    }
  }
];

const BlogCategoryTable = ({
  isLoading,
  className
}: {
  isLoading: boolean;
  className?: string;
}) => {
  return (
    <div className={className}>
      <AdvanceTable
        headerCellClassName="border-b border-b-base"
        cellClassName="border-b border-b-base"
        isLoading={isLoading}
      />
      {!isLoading && (
        <AdvanceTablePagination className="my-10 md:my-12.5 px-7 md:px-8.5" />
      )}
    </div>
  );
};

export default BlogCategoryTable;
