import Image from 'next/image';
import { LuEye } from '@repo/icons/lu';
import { MdDelete } from '@repo/icons/md';
import { VscEdit } from '@repo/icons/vsc';
import { Testimonial } from '@repo/types';
import { Button } from '@repo/ui/components';
import { textTrimmer } from '@repo/ui/utils';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { AdvanceTablePagination } from 'components/base/AdvanceTablePagination';

export const testimonialTableColumn = (): ColumnDef<Testimonial>[] => [
  {
    accessorKey: 'image',
    header: 'Photo',
    cell: ({ row: { original } }) =>
      original.image ? (
        <Image
          src={original.image}
          alt={original.name}
          width={60}
          height={60}
          className="size-15 rounded-full object-cover"
        />
      ) : (
        <span className="text-secondary-300">-</span>
      ),
    meta: { cellProps: { className: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row: { original } }) => (
      <span>{textTrimmer(original.name, 20)}</span>
    ),
    meta: {
      headerProps: { className: 'text-start' },
      cellProps: { className: 'whitespace-nowrap' }
    }
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row: { original } }) => (
      <span>{textTrimmer(original.designation, 20)}</span>
    ),
    meta: { cellProps: { className: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row: { original } }) => (
      <span>{textTrimmer(original.company, 20)}</span>
    ),
    meta: { cellProps: { className: 'whitespace-nowrap' } }
  },
  {
    accessorKey: 'description',
    header: 'Testimonial',
    cell: ({ row: { original } }) => (
      <span className="text-secondary-300">
        {textTrimmer(original.description, 20)}
      </span>
    ),
    meta: {
      cellProps: {
        className: 'whitespace-nowrap'
      }
    }
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

interface TestimonialTableProps {
  isLoading?: boolean;
  className?: string;
  data: Testimonial[];
  onReorder: (items: Testimonial[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const TestimonialTable = ({
  className,
  isLoading,
  data,
  onReorder,
  onEdit,
  onView,
  onDelete
}: TestimonialTableProps) => {
  return (
    <div className={className}>
      <AdvanceTable<Testimonial>
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

export default TestimonialTable;
