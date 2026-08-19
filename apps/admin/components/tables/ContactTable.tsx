import { LuEye } from '@repo/icons/lu';
import { MdDelete } from '@repo/icons/md';
import { Contact } from '@repo/types';
import { Badge, Button } from '@repo/ui/components';
import { textTrimmer } from '@repo/ui/utils';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import TimeAgo from 'utils/helpers/TimeCalculator';

export const contactTableColumn = (
  onView: (row: number) => void,
  onDelete: (row: number) => void
): ColumnDef<Contact>[] => [
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
      <Badge color="primary">
        <a
          href={`mailto:${original.email}`}
          className="no-underline text-info-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {original.email}
        </a>
      </Badge>
    ),
    meta: {
      cellProps: {
        className: 'whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'ip',
    header: 'IP',
    meta: {
      cellProps: {
        className: 'whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row: { original } }) => (
      <span className="line-clamp-2">{original.message}</span>
    ),

    meta: {
      headerProps: {
        className: 'min-w-35'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Received At',
    cell: ({ row: { original } }) => {
      const { createdAt } = original;

      return (
        <>
          <TimeAgo time={createdAt} />
        </>
      );
    },
    meta: {
      headerProps: {
        className: 'whitespace-nowrap'
      },
      cellProps: {
        className: 'whitespace-nowrap'
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
            variant="filled"
            color="success"
            size="sm"
            className="px-2"
            onClick={() => onView(original.id)}
          >
            <LuEye className="size-4" />
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

interface ContactTableProps {
  isLoading: boolean;
  className?: string;
}

const ContactTable = ({ isLoading, className }: ContactTableProps) => {
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

export default ContactTable;
