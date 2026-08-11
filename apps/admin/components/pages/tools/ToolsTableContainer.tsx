import { useMemo } from 'react';
import ToolsTable, { toolsTableColumns } from 'components/tables/ToolsTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useGetAllTools } from 'hooks/queries/useToolsQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface ToolsTableContainerProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ToolsTableContainer = ({
  onEdit,
  onDelete
}: ToolsTableContainerProps) => {
  const { data, isLoading } = useGetAllTools();
  const columns = useMemo(() => toolsTableColumns(onEdit, onDelete), []);
  const table = useAdvanceTable({
    columns,
    data: data ?? [],
    selection: true,
    pagination: true,
    pageSize: 10
  });
  return (
    <AdvanceTableProvider table={table}>
      <ToolsTable isLoading={isLoading} />
    </AdvanceTableProvider>
  );
};

export default ToolsTableContainer;
