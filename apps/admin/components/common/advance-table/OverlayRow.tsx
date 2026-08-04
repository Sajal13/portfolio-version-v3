'use client';

import type { ReactNode } from 'react';
import { Button } from '@repo/ui/components';
import { flexRender, type Table } from '@tanstack/react-table';
import classNames from 'classnames';
import { LuGripVertical } from 'react-icons/lu';

export function OverlayRow<TData extends { id: number }>({
  table,
  item,
  renderOverlayActions
}: {
  table: Table<TData>;
  item: TData;
  renderOverlayActions?: (row: TData) => ReactNode;
}) {
  const tableRow = table
    .getRowModel()
    .rows.find((r) => r.original.id === item.id);
  if (!tableRow) return null;

  return (
    <table className="w-full table-auto">
      <tbody>
        <tr className="border-base rounded-lg border bg-neutral-700 shadow-2xl">
          {tableRow.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={classNames(
                'px-4 py-2',
                cell.column.columnDef.meta?.cellProps?.className
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}

          {renderOverlayActions && (
            <td className="px-4 py-2 text-center">
              {renderOverlayActions(item)}
            </td>
          )}

          <td className="px-4 py-2 text-center">
            <Button
              variant="link"
              className="touch-none cursor-grabbing text-secondary-800"
            >
              <LuGripVertical size={18} />
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
