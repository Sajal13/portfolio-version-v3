import Image from 'next/image';
import { Blog } from '@repo/types';
import { Button } from '@repo/ui/components';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';
import { MdDelete } from 'react-icons/md';
import { VscEdit } from 'react-icons/vsc';
import TimeAgo from 'utils/helpers/TimeCalculator';

export const blogsTableColumns = (
  onEdit: (row: number) => void,
  onDelete: (row: number) => void
): ColumnDef<Blog>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      return <span>{row.original.title}</span>;
    },
    meta: {
      headerProps: {
        className: 'min-w-40 text-start'
      },
      cellProps: {
        className: 'font-medium'
      }
    }
  },
  {
    accessorKey: 'image',
    header: 'Title Image',
    cell: ({ row: { original } }) => {
      const image = original.image;

      return (
        <Image
          src={original.image}
          alt={original.title}
          width={400}
          height={250}
          className="w-full h-auto object-cover"
        />
      );
    },
    meta: {
      cellProps: {
        className: 'text-center'
      },
      headerProps: {
        className: 'whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'markdown_title',
    header: 'Markdown',
    cell: ({ row: { original } }) => {
      const { originalName } = original.markdown;

      return <span>{originalName}</span>;
    },
    meta: {
      cellProps: {
        className: 'whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'tools_name',
    header: 'Tools',
    cell: ({ row: { original } }) => {
      const tools = original.tools.map((tool) => tool.name).join(', ');

      return <span>{tools}</span>;
    },
    meta: {
      cellProps: {
        className: 'whitespace-nowrap text-center'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row: { original } }) => {
      return <span>{<TimeAgo time={original.createdAt} />}</span>;
    },
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

const BlogsTable = ({
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

export default BlogsTable;
