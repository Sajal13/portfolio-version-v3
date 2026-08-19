import { useMemo } from 'react';
import { Testimonial } from '@repo/types';
import TestimonialTable, {
  testimonialTableColumn
} from 'components/tables/TestimonialTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface TestimonialTableContainerProps {
  items: Testimonial[];
  isLoading?: boolean;
  onReorder: (newItems: Testimonial[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const TestimonialTableContainer = ({
  items,
  isLoading,
  onReorder,
  onEdit,
  onDelete,
  onView
}: TestimonialTableContainerProps) => {
  const columns = useMemo(() => testimonialTableColumn(), []);

  const table = useAdvanceTable({
    data: items,
    columns,
    pagination: true,
    pageSize: 10
  });

  return (
    <AdvanceTableProvider table={table}>
      <TestimonialTable
        isLoading={isLoading}
        data={items}
        onReorder={onReorder}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </AdvanceTableProvider>
  );
};

export default TestimonialTableContainer;
