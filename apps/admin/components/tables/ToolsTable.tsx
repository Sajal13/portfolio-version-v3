import Image from 'next/image';
import { Tool } from '@repo/types';
import { Button } from '@repo/ui/components';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import { MdDelete } from 'react-icons/md';
import { VscEdit } from 'react-icons/vsc';

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
              width={300}
              height={250}
              className="w-full h-auto"
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
        className: 'whitespace-nowrap flex-1 min-w-60'
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
        className: 'whitespace-nowrap'
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
