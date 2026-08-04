'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { flexRender } from '@tanstack/react-table';
import classNames from 'classnames';
import { useAdvanceTableContext } from 'context/AdvanceTableProvider';
import { useGetDndSensor } from 'hooks/useDndSensor';
import { createPortal } from 'react-dom';
import { FaSortDown, FaSortUp, FaSort } from 'react-icons/fa6';
import { LuLoaderCircle } from 'react-icons/lu';
import { OverlayRow } from '../common/advance-table/OverlayRow';
import { SortableRow } from '../common/advance-table/SortableRow';

export type WithId = { id: number };

interface AdvanceTableProps<T extends WithId = WithId> {
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  tableProps?: React.TableHTMLAttributes<HTMLTableElement>;
  headerClassName?: string;
  headerCellClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  hasFooter?: boolean;

  // Drag-and-drop is opt-in. Passing onReorder switches the body from
  // static rows to sortable ones, using the same table instance and
  // columns — no second component, no duplicated table setup.
  data?: T[];
  onReorder?: (newItems: T[]) => void;
  renderRowActions?: (row: T) => ReactNode;
  renderOverlayActions?: (row: T) => ReactNode;
}

function AdvanceTable<T extends WithId = WithId>({
  isLoading = false,
  emptyMessage = 'No results found.',
  className,
  tableProps,
  headerClassName,
  headerCellClassName,
  headerRowClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  hasFooter,
  data,
  onReorder,
  renderRowActions,
  renderOverlayActions
}: AdvanceTableProps<T>) {
  const table = useAdvanceTableContext<T>();
  const rows = table.getRowModel().rows;
  const dndEnabled = Boolean(onReorder && data);

  const sensors = useGetDndSensor();
  const [activeItem, setActiveItem] = useState<T | null>(null);
  const sortableIds = useMemo(() => (data ?? []).map((i) => i.id), [data]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveItem(data?.find((i) => i.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveItem(null);
    if (!over || active.id === over.id || !data || !onReorder) return;
    const oldIndex = data.findIndex((i) => i.id === active.id);
    const newIndex = data.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(data, oldIndex, newIndex));
  };

  const bodyContent = (
    <tbody className={bodyClassName}>
      {rows.length === 0 ? (
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="h-40 text-center text-zinc-500"
          >
            {emptyMessage}
          </td>
        </tr>
      ) : dndEnabled ? (
        rows.map((row) => (
          <SortableRow
            key={row.id}
            tableRow={row}
            renderRowActions={renderRowActions}
          />
        ))
      ) : (
        rows.map((row) => (
          <tr
            key={row.id}
            data-selected={row.getIsSelected()}
            className={classNames(
              'group transition-colors duration-150',
              rowClassName
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                {...cell.column.columnDef.meta?.cellProps}
                className={classNames(
                  'px-4 py-3.25 align-middle',
                  cellClassName,
                  cell.column.columnDef.meta?.cellProps?.className
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );

  const tableEl = (
    <table
      {...tableProps}
      className={classNames('w-full text-sm', tableProps?.className)}
    >
      <thead className={headerClassName}>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id} className={headerRowClassName}>
            {hg.headers.map((header) => {
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted();
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    width:
                      header.getSize() !== 150 ? header.getSize() : undefined
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                  {...header.column.columnDef.meta?.headerProps}
                  className={classNames(
                    'h-15.5 px-4 align-middle',
                    canSort &&
                      'relative cursor-pointer select-none transition-colors hover:text-secondary-200',
                    headerCellClassName,
                    header.column.columnDef.meta?.headerProps?.className
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort && (
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white opacity-70">
                          {sorted === 'asc' ? (
                            <FaSortUp className="h-4 w-4" />
                          ) : sorted === 'desc' ? (
                            <FaSortDown className="h-4 w-4" />
                          ) : (
                            <FaSort className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </th>
              );
            })}
            {dndEnabled && renderRowActions && (
              <th className="h-15.5 border-b border-b-base px-4 align-middle text-center">
                Actions
              </th>
            )}
            {dndEnabled && (
              <th className="h-15.5 min-w-10 border-b border-b-base px-4 align-middle" />
            )}
          </tr>
        ))}
      </thead>

      {bodyContent}

      {hasFooter && (
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id} className="border-translucent border-0">
              {footerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  {...header.column.columnDef.meta?.footerProps}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      )}
    </table>
  );

  return (
    <div className={classNames('relative w-full overflow-auto', className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-secondary-700">
          <LuLoaderCircle className="h-5 w-5 animate-spin text-red-500" />
        </div>
      )}

      {dndEnabled ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveItem(null)}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            {tableEl}
          </SortableContext>

          {typeof window !== 'undefined' &&
            createPortal(
              <DragOverlay
                dropAnimation={{
                  duration: 180,
                  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
                }}
              >
                {activeItem && (
                  <OverlayRow
                    table={table}
                    item={activeItem}
                    renderOverlayActions={
                      renderOverlayActions ?? renderRowActions
                    }
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      ) : (
        tableEl
      )}
    </div>
  );
}

export default AdvanceTable;
