import { Skill } from '@repo/types';
import { Badge, Button } from '@repo/ui/components';
import { textFormatter } from '@repo/ui/utils';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import { MdDelete } from 'react-icons/md';
import { VscEdit } from 'react-icons/vsc';

export const skillsTableColumn = (
  onEdit: (row: number) => void,
  onDelete: (row: number) => void
): ColumnDef<Skill>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    meta: {
      headerProps: {
        className: 'text-start'
      },
      cellProps: {
        className: 'whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    meta: {
      cellProps: {
        className: 'text-center'
      }
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row: { original } }) => {
      const str = textFormatter(original.category);
      return <span className="capitalize">{str}</span>;
    },
    meta: {
      cellProps: {
        className: 'text-center whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'parent',
    header: 'Parent',
    cell: ({ row: { original } }) => {
      const str = textFormatter(original.parent);

      return <span className="capitalize">{str}</span>;
    },
    meta: {
      cellProps: {
        className: 'text-center whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row: { original } }) => {
      const { isActive } = original;
      return (
        <Badge color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    meta: {
      cellProps: {
        className: 'text-center'
      }
    }
  },
  {
    id: 'action',
    header: 'Action',
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

interface SkillTableProps {
  isLoading?: boolean;
  className?: string;
}

const SkillTable = ({ className, isLoading }: SkillTableProps) => {
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

export default SkillTable;
