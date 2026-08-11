'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Portal } from '../utils/Portal';
import { cn } from '../utils/cn';
import { useEscapeKey, useOutsideClick } from '../utils/useOverlay';

export interface SearchableSelectOption {
  label: string;
  value: string;
}

const triggerVariants = cva(
  `flex w-full min-w-0 flex-wrap items-center gap-1.5 rounded-md border border-main
   bg-secondary-700 text-white outline-none transition-colors cursor-pointer
   focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
   disabled:cursor-not-allowed disabled:opacity-50
   aria-invalid:border-error-500 aria-invalid:ring-2 aria-invalid:ring-error-500/30`,
  {
    variants: {
      size: {
        sm: 'min-h-8 px-3 text-xs',
        base: 'min-h-9 px-4 text-sm',
        md: 'min-h-10 px-5 text-sm',
        lg: 'min-h-11 px-7 text-base'
      }
    },
    defaultVariants: { size: 'base' }
  }
);

function ChevronDownIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SpinnerIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('animate-spin', className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={2}
        strokeOpacity={0.25}
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Create a cache object at module scope and pass it to multiple instances
 * of SearchableSelect (e.g. the same "select a tag" field used in several
 * forms) so they share fetched options instead of each doing its own fetch. */
export function createSelectCache() {
  return new Map<string, SearchableSelectOption[]>();
}

type SearchableSelectValue = string | string[] | null;

interface SearchableSelectProps extends VariantProps<typeof triggerVariants> {
  value: SearchableSelectValue;
  onValueChange: (value: SearchableSelectValue) => void;
  loadOptions: (query: string) => Promise<SearchableSelectOption[]>;
  isMulti?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
  /** Pass a cache created with createSelectCache() to share fetched
   * results across multiple mounts of this component. Defaults to a
   * cache scoped to this instance only. */
  cache?: Map<string, SearchableSelectOption[]>;
  /** Seed labels for values the parent already knows about (e.g. editing
   * a record where the selected option's id is known but hasn't been
   * fetched from loadOptions yet). Without this, an already-selected
   * value shows as its raw id until the matching option is fetched. */
  initialOptions?: SearchableSelectOption[];
  noOptionsText?: string;
}

function SearchableSelect({
  value,
  onValueChange,
  loadOptions,
  isMulti = false,
  placeholder = 'Select…',
  disabled,
  className,
  size,
  debounceMs = 350,
  cache,
  initialOptions,
  noOptionsText = 'No options found'
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [options, setOptions] = React.useState<SearchableSelectOption[]>(
    initialOptions ?? []
  );
  const [loading, setLoading] = React.useState(false);
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const floatingRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const instanceCacheRef = React.useRef<Map<string, SearchableSelectOption[]>>(
    cache ?? new Map()
  );
  const labelMapRef = React.useRef<Map<string, string>>(
    new Map((initialOptions ?? []).map((o) => [o.value, o.label]))
  );

  useEscapeKey(open, () => setOpen(false));
  useOutsideClick(open, [triggerRef, floatingRef], () => setOpen(false));

  const selectedValues = React.useMemo<string[]>(
    () =>
      isMulti ? ((value as string[]) ?? []) : value ? [value as string] : [],
    [value, isMulti]
  );

  const fetchOptions = React.useCallback(
    async (q: string) => {
      const cacheKey = q.trim().toLowerCase();
      const cached = instanceCacheRef.current.get(cacheKey);
      if (cached) {
        setOptions(cached);
        return;
      }
      setLoading(true);
      try {
        const result = await loadOptions(q);
        instanceCacheRef.current.set(cacheKey, result);
        result.forEach((o) => labelMapRef.current.set(o.value, o.label));
        setOptions(result);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [loadOptions]
  );

  const updatePosition = React.useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
    fetchOptions(query);
    const first = floatingRef.current?.querySelector<HTMLInputElement>('input');
    first?.focus();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOptions(query), debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelect = (option: SearchableSelectOption) => {
    labelMapRef.current.set(option.value, option.label);
    if (isMulti) {
      const exists = selectedValues.includes(option.value);
      const next = exists
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      onValueChange(next);
    } else {
      onValueChange(option.value);
      setOpen(false);
      setQuery('');
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti) onValueChange(selectedValues.filter((v) => v !== val));
    else onValueChange(null);
  };

  const singleSelectedValue = !isMulti ? selectedValues[0] : undefined;

  return (
    <div className="relative w-full">
      <button
        type="button"
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        data-slot="searchable-select-trigger"
        className={cn(triggerVariants({ size, className }))}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        {selectedValues.length === 0 && (
          <span className="text-neutral-400 truncate">{placeholder}</span>
        )}

        {isMulti
          ? selectedValues.map((val) => (
              <span
                key={val}
                className="flex items-center gap-1 rounded bg-secondary-600 px-2 py-0.5 text-xs text-white"
              >
                {labelMapRef.current.get(val) ?? val}
                <XIcon
                  className="size-3 cursor-pointer hover:text-error-500"
                  onClick={(e) =>
                    removeValue(val, e as unknown as React.MouseEvent)
                  }
                />
              </span>
            ))
          : selectedValues[0] && (
              <span className="truncate">
                {labelMapRef.current.get(selectedValues[0]) ??
                  selectedValues[0]}
              </span>
            )}

        <span className="ml-auto flex items-center gap-1 shrink-0 text-neutral-400">
          {singleSelectedValue && !disabled && (
            <XIcon
              className="size-3.5 cursor-pointer hover:text-error-500"
              onClick={(e) => {
                e.stopPropagation();
                removeValue(singleSelectedValue, e);
              }}
            />
          )}
          {loading ? (
            <SpinnerIcon className="size-3.5" />
          ) : (
            <ChevronDownIcon
              className={cn(
                'size-4 transition-transform',
                open && 'rotate-180'
              )}
            />
          )}
        </span>
      </button>

      {open && (
        <Portal>
          <div
            ref={floatingRef}
            data-slot="searchable-select-content"
            style={{
              position: 'fixed',
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
              width: coords?.width
            }}
            className={cn(
              'z-50 rounded-md border border-main bg-secondary-700 shadow-md outline-none transition-opacity',
              coords ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="border-b border-main p-1.5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full rounded bg-secondary-800 px-2 py-1.5 text-sm text-white outline-none placeholder:text-neutral-400"
              />
            </div>

            <div role="listbox" className="max-h-56 overflow-y-auto p-1">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-4 text-xs text-neutral-400">
                  <SpinnerIcon className="size-3.5" /> Loading…
                </div>
              )}

              {!loading && options.length === 0 && (
                <div className="py-4 text-center text-xs text-neutral-400">
                  {noOptionsText}
                </div>
              )}

              {!loading &&
                options.map((opt) => {
                  const checked = selectedValues.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={checked}
                      data-state={checked ? 'checked' : 'unchecked'}
                      className={cn(
                        `flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
                         hover:bg-primary-500 hover:text-white data-[state=checked]:font-medium`
                      )}
                      onClick={() => handleSelect(opt)}
                    >
                      {opt.label}
                      {checked && <CheckIcon className="size-4" />}
                    </div>
                  );
                })}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

export { SearchableSelect };
export type { SearchableSelectProps, SearchableSelectValue };
