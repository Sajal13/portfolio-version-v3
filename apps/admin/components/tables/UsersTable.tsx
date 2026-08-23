import { MdDelete } from '@repo/icons/md';
import { User } from '@repo/types';
import { Badge, Button } from '@repo/ui/components';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import dayjs from 'dayjs';

export const usersTableColumn = (
  onDelete: (row: number) => void
): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      cellProps: {
        className: 'whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row: { original } }) => (
      <Badge color="primary">{original.email}</Badge>
    ),
    meta: {
      cellProps: {
        className: 'whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row: { original } }) => (
      <Badge
        color={original.role === 'admin' ? 'primary' : 'secondary'}
        className="uppercase"
      >
        {original.role}
      </Badge>
    ),
    meta: {
      cellProps: {
        className: 'whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row: { original } }) => (
      <>{dayjs(original.createdAt).format('MMM DD, YYYY')}</>
    ),
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
    id: 'actions',
    header: 'Action',
    cell: ({ row: { original } }) => {
      return (
        <Button
          variant="filled"
          color="error"
          size="sm"
          className="px-2"
          onClick={() => onDelete(original.id)}
        >
          <MdDelete className="size-4" />
        </Button>
      );
    }
  }
];

interface UserTableProps {
  isLoading: boolean;
  className?: string;
}

const UserTable = ({ isLoading, className }: UserTableProps) => {
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

export default UserTable;
