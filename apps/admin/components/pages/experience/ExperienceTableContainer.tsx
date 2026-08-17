import { useMemo } from 'react';
import { Experience } from '@repo/types';
import ExperienceTable, {
  experienceTableColumn
} from 'components/tables/ExperienceTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface ExperienceTableContainerProps {
  items: Experience[];
  isLoading?: boolean;
  onReorder: (newItems: Experience[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ExperienceTableContainer = ({
  items,
  isLoading,
  onReorder,
  onEdit,
  onDelete,
  onView
}: ExperienceTableContainerProps) => {
  const columns = useMemo(() => experienceTableColumn(), []);

  const table = useAdvanceTable({
    data: items,
    columns,
    pagination: true,
    pageSize: 10
  });

  return (
    <AdvanceTableProvider table={table}>
      <ExperienceTable
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

export default ExperienceTableContainer;
