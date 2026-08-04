'use client';

import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@repo/ui/components';
import { flexRender, type Row } from '@tanstack/react-table';
import classNames from 'classnames';
import { LuGripVertical } from 'react-icons/lu';

export function SortableRow<TData extends { id: number }>({
  tableRow,
  renderRowActions
}: {
  tableRow: Row<TData>;
  renderRowActions?: (row: TData) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tableRow.original.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t border-t-base">
      {tableRow.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className={classNames(
            'px-4 py-3.25 align-middle',
            cell.column.columnDef.meta?.cellProps?.className
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}

      {renderRowActions && (
        <td className="px-4 py-3.25 align-middle">
          {renderRowActions(tableRow.original)}
        </td>
      )}

      <td className="px-4 py-3.25 align-middle">
        <Button
          variant="link"
          className="mx-auto cursor-grab touch-none text-secondary-800 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <LuGripVertical size={18} />
        </Button>
      </td>
    </tr>
  );
}
