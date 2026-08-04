'use client';

import classNames from 'classnames';
import { useAdvanceTableContext } from 'context/AdvanceTableProvider';
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight
} from 'react-icons/lu';
import PaginationButton from '../common/advance-table/PaginationButton';

interface AdvanceTablePaginationProps {
  showSummary?: boolean;
  maxVisible?: number;
  className?: string;
  totalRows?: number;
}

interface BuildPagesParams {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  maxVisible: number;
}

function buildPages({
  pageCount,
  pageIndex,
  maxVisible
}: BuildPagesParams): (number | '...')[] {
  if (pageCount <= maxVisible + 2) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const current = pageIndex + 1;
  const pages: (number | '...')[] = [];

  // Always show first page
  pages.push(1);

  // Calculate window around current page
  const windowStart = Math.max(2, current - Math.floor(maxVisible / 2));
  // const windowEnd = Math.min(pageCount - 1, windowStart + maxVisible - 1);

  // Adjust window if it hits the end
  const adjustedStart = Math.max(
    2,
    Math.min(windowStart, pageCount - maxVisible)
  );
  const adjustedEnd = Math.min(pageCount - 1, adjustedStart + maxVisible - 1);

  // Ellipsis before window
  if (adjustedStart > 2) {
    pages.push('...');
  }

  // Pages in window
  for (let i = adjustedStart; i <= adjustedEnd; i++) {
    pages.push(i);
  }

  // Ellipsis after window
  if (adjustedEnd < pageCount - 1) {
    pages.push('...');
  }

  // Always show last page
  pages.push(pageCount);

  return pages;
}

export function AdvanceTablePagination({
  showSummary = true,
  maxVisible = 3,
  className,
  totalRows: totalRowsProps
}: AdvanceTablePaginationProps) {
  const table = useAdvanceTableContext();
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows =
    totalRowsProps ??
    (table.options.meta as { totalCount?: number })?.totalCount ??
    table.getFilteredRowModel().rows.length;

  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const pages = buildPages({
    pageCount,
    pageIndex,
    pageSize,
    maxVisible
  });

  return (
    <div
      className={classNames(
        'flex flex-col sm:flex-row items-center gap-4 justify-between',
        className
      )}
    >
      {/* Summary */}
      {showSummary && (
        <p className="text-secondary-900 shrink-0 font-semibold">
          Showing{' '}
          <span>
            {from}–{to}
          </span>{' '}
          of <span>{totalRows}</span> items
        </p>
      )}

      {pages.length > 0 && (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          <PaginationButton
            onClick={() => table.firstPage()}
            disabled={!canPrev}
            aria-label="First page"
          >
            <LuChevronsLeft size={16} />
          </PaginationButton>
          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={!canPrev}
            aria-label="Previous page"
          >
            <LuChevronLeft size={16} />
          </PaginationButton>

          {pages.map((page, i) =>
            page === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2.5 py-1.5 text-center bg-secondary-700  text-xs select-none"
              >
                …
              </span>
            ) : (
              <PaginationButton
                key={page}
                active={page - 1 === pageIndex}
                onClick={() => table.setPageIndex(page - 1)}
                aria-label={`Page ${page}`}
                aria-current={page - 1 === pageIndex ? 'page' : undefined}
              >
                {page}
              </PaginationButton>
            )
          )}

          {/* ⟩ Next */}
          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={!canNext}
            aria-label="Next page"
          >
            <LuChevronRight size={16} />
          </PaginationButton>

          {/* ⟩⟩ Last */}
          <PaginationButton
            onClick={() => table.lastPage()}
            disabled={!canNext}
            aria-label="Last page"
          >
            <LuChevronsRight size={16} />
          </PaginationButton>
        </nav>
      )}
    </div>
  );
}
