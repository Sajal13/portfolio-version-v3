import Image from 'next/image';
import { MdDelete } from '@repo/icons/md';
import { VscEdit } from '@repo/icons/vsc';
import { Tool } from '@repo/types';
import { Button } from '@repo/ui/components';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';

export const toolsTableColumns = (
  onEdit: (row: number) => void,
  onDelete: (row: number) => void
): ColumnDef<Tool>[] => [
  {
    accessorKey: 'icon',
    header: 'Icon',
    cell: ({ row: { original } }) => {
      return (
        <>
          {original.icon ? (
            <Image
              src={original.icon}
              alt={original.name}
              width={36}
              height={36}
              className="w-full h-10 object-contain"
            />
          ) : (
            <span className="text-error-500">N/A</span>
          )}
        </>
      );
    },
    meta: {
      cellProps: {
        className: 'whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      headerProps: {
        className: 'whitespace-nowrap flex-1 md:min-w-30 text-start'
      },
      cellProps: {
        className: 'whitespace-nowrap align-middle'
      }
    }
  },

  {
    accessorKey: 'docUrl',
    header: 'Doc Url',
    meta: {
      headerProps: {
        className: 'whitespace-nowrap md:min-w-60'
      },
      cellProps: {
        className: 'whitespace-nowrap text-center'
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

interface ToolsTableProps {
  isLoading: boolean;
  className?: string;
}

const ToolsTable = ({ isLoading, className }: ToolsTableProps) => {
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

export default ToolsTable;
