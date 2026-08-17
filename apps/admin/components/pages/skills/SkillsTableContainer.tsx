import React, { useMemo } from 'react';
import SkillTable, { skillsTableColumn } from 'components/tables/SkillsTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useGetAllSkills } from 'hooks/queries/useSkillQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface SkillsTableContainerProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SkillsTableContainer = ({
  onEdit,
  onDelete
}: SkillsTableContainerProps) => {
  const { data, isLoading } = useGetAllSkills();

  const columns = useMemo(() => skillsTableColumn(onEdit, onDelete), []);

  const table = useAdvanceTable({
    data: data ?? [],
    columns,
    selection: true,
    pagination: true,
    pageSize: 10
  });
  return (
    <AdvanceTableProvider table={table}>
      <SkillTable isLoading={isLoading} />
    </AdvanceTableProvider>
  );
};

export default SkillsTableContainer;
