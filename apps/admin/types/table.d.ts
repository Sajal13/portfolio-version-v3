import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerProps?: React.ThHTMLAttributes<HTMLTableCellElement>;
    cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
    footerProps?: React.ThHTMLAttributes<HTMLTableCellElement>;
  }
}
