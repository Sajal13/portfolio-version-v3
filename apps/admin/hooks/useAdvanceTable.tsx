import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { IndeterminateCheckbox } from '@repo/ui/components';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type InitialTableState,
  type Table,
  type Row,
  type ColumnFiltersState,
  type OnChangeFn,
  type FilterFnOption,
  type RowSelectionState,
  type TableOptions
} from '@tanstack/react-table';

interface UseAdvanceTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  selection?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  initialState?: InitialTableState;
  state?: Partial<TableOptions<T>['state']>;
  onPaginationChange?: TableOptions<T>['onPaginationChange'];
  manualPagination?: boolean;
  rowCount?: number;
  pageCount?: number;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilterFn?: FilterFnOption<T>;
  meta?: Record<string, unknown>;
  onRowSelectionChange?: Dispatch<SetStateAction<RowSelectionState>>;
}

function createSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: 'select',
    header: ({ table }: { table: Table<T> }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <IndeterminateCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    meta: {
      headerProps: { className: 'text-start flex items-center' },
      cellProps: { className: 'text-start' }
    }
  };
}

export function useAdvanceTable<T>({
  columns,
  data,
  selection = false,
  sortable = false,
  pagination = false,
  pageSize = 10,
  initialState,
  state,
  onGlobalFilterChange,
  onColumnFiltersChange,
  globalFilterFn,
  ...rest
}: UseAdvanceTableProps<T>): Table<T> {
  const finalColumns = useMemo(
    () => (selection ? [createSelectionColumn<T>(), ...columns] : columns),
    [selection, columns]
  );

  return useReactTable<T>({
    data,
    columns: finalColumns,
    enableSorting: sortable,
    enableRowSelection: selection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    ...(globalFilterFn && { globalFilterFn }),
    onGlobalFilterChange,
    onColumnFiltersChange,
    initialState: {
      ...initialState,
      ...(pagination ? { pagination: { pageSize } } : {})
    },
    state,
    ...rest
  });
}
