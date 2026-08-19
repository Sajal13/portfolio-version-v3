import { useMemo } from 'react';
import { Portfolio } from '@repo/types';
import PortfolioTable, {
  portfolioTableColumn
} from 'components/tables/PortfolioTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface PortfolioTableContainerProps {
  items: Portfolio[];
  isLoading?: boolean;
  onReorder: (newItems: Portfolio[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const PortfolioTableContainer = ({
  items,
  isLoading,
  onReorder,
  onEdit,
  onDelete,
  onView
}: PortfolioTableContainerProps) => {
  const columns = useMemo(() => portfolioTableColumn(), []);

  const table = useAdvanceTable({
    data: items,
    columns,
    pagination: true,
    pageSize: 10
  });

  return (
    <AdvanceTableProvider table={table}>
      <PortfolioTable
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

export default PortfolioTableContainer;
