'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react';
import {
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuChevronDown,
  LuClock
} from '@repo/icons/lu';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import {
  DAY_LABELS,
  MONTH_LABELS,
  addMonths,
  buildCalendarMatrix,
  formatDateTime,
  isDateDisabled,
  isSameDay,
  parseDateTimeValue,
  setTimeOnDate,
  to12Hour,
  to24Hour,
  type DateBound
} from '../utils/date-time';

// Reuses the exact same size/border/color tokens as `Input` so the trigger field is
// visually indistinguishable from a regular text input until it's opened.
const inputVariants = cva(
  `flex w-full min-w-0 rounded-md border border-main bg-secondary-700 text-white
   placeholder:text-neutral-400 outline-none transition-colors cursor-pointer
   focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/30
   disabled:cursor-not-allowed disabled:opacity-50
   aria-invalid:border-error-500 aria-invalid:ring-2 aria-invalid:ring-error-500/30`,
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        base: 'h-9 px-4 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-11 px-7 text-base'
      }
    },
    defaultVariants: {
      size: 'base'
    }
  }
);

export type DateTimePickerMode = 'date' | 'time' | 'datetime';
export type DateTimePickerIconPosition = 'start' | 'end';

export interface DateTimePickerProps
  extends
    Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue' | 'children'>,
    VariantProps<typeof inputVariants> {
  /** Controlled value, already formatted (or any parseable date string). Pass `null`/`""` to clear. */
  value?: string | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | null;
  /** Fires on every change with the formatted string (per `format`) and the underlying Date. */
  onChange?: (value: string | null, date: Date | null) => void;

  /** `date` shows only the calendar, `time` shows only the time controls, `datetime` shows both. */
  mode?: DateTimePickerMode;

  /** Optional leading/trailing icon, same slot pattern as `Input`. Defaults to a calendar/clock icon. */
  icon?: React.ReactNode;
  iconPosition?: DateTimePickerIconPosition;
  /** Non-editable text rendered before the value, e.g. "Due:" */
  prefix?: string;

  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  'aria-invalid'?: boolean;

  /** Output/parse format tokens: yyyy MM dd HH hh mm ss A a. Defaults depend on `mode`. */
  format?: string;

  minDate?: DateBound;
  maxDate?: DateBound;
  /** Convenience shorthand for `maxDate = today`. */
  disableFuture?: boolean;
  /** Convenience shorthand for `minDate = today`. */
  disablePast?: boolean;
  /** Custom per-day disable predicate, combined with the bounds above. */
  disabledDates?: (date: Date) => boolean;

  minuteStep?: number;
  /** Auto-close the panel as soon as a day is picked. Defaults to `true` for `mode="date"`, `false` otherwise. */
  closeOnSelect?: boolean;

  panelClassName?: string;
}

const DEFAULT_FORMAT: Record<DateTimePickerMode, string> = {
  date: 'yyyy-MM-dd',
  time: 'hh:mm A',
  datetime: 'yyyy-MM-dd hh:mm A'
};

function clampNum(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function DateTimePicker({
  value,
  defaultValue = null,
  onChange,
  mode = 'date',
  icon,
  iconPosition = 'start',
  prefix,
  placeholder,
  disabled,
  name,
  id,
  format,
  size,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  disabledDates,
  minuteStep = 1,
  closeOnSelect,
  className,
  panelClassName,
  'aria-invalid': ariaInvalid,
  ...divProps
}: DateTimePickerProps) {
  const resolvedFormat = format ?? DEFAULT_FORMAT[mode];
  const showCalendar = mode === 'date' || mode === 'datetime';
  const showTime = mode === 'time' || mode === 'datetime';
  const shouldCloseOnSelect = closeOnSelect ?? mode === 'date';

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue
  );
  const currentValue = isControlled ? (value ?? null) : internalValue;
  const selectedDate = useMemo(
    () => parseDateTimeValue(currentValue),
    [currentValue]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selectedDate ?? new Date());
  const [draftHour24, setDraftHour24] = useState<number>(
    selectedDate?.getHours() ?? 12
  );
  const [draftMinute, setDraftMinute] = useState<number>(
    selectedDate?.getMinutes() ?? 0
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  const bounds = {
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    disabledDates
  };

  // Keep the visible month + draft time in sync whenever the panel opens or the value changes underneath us.
  useEffect(() => {
    if (!isOpen) return;
    setViewDate(selectedDate ?? new Date());
    const { hour24, minute } = selectedDate
      ? { hour24: selectedDate.getHours(), minute: selectedDate.getMinutes() }
      : { hour24: 12, minute: 0 };
    setDraftHour24(hour24);
    setDraftMinute(minute);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Outside click + Escape to close. Swap this block out for your shared
  // `useOutsideClick` / `useEscapeKey` hooks if you'd rather centralize it.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Flip the panel above the field if there isn't enough viewport room below.
  useEffect(() => {
    if (!isOpen || !rootRef.current || !panelRef.current) return;
    const triggerRect = rootRef.current.getBoundingClientRect();
    const panelHeight = panelRef.current.offsetHeight;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    setOpenUpward(
      spaceBelow < panelHeight + 12 && triggerRect.top > panelHeight + 12
    );
  }, [isOpen, viewDate, showTime]);

  const commit = useCallback(
    (date: Date | null) => {
      const formatted = date ? formatDateTime(date, resolvedFormat) : null;
      if (!isControlled) setInternalValue(formatted);
      onChange?.(formatted, date);
    },
    [isControlled, onChange, resolvedFormat]
  );

  function handleDayClick(day: Date) {
    if (isDateDisabled(day, bounds)) return;
    const next = showTime
      ? setTimeOnDate(day, draftHour24, draftMinute)
      : setTimeOnDate(day, 0, 0);
    commit(next);
    if (shouldCloseOnSelect) setIsOpen(false);
  }

  function applyTime(hour24: number, minute: number) {
    setDraftHour24(hour24);
    setDraftMinute(minute);
    const base = selectedDate ?? (showCalendar ? viewDate : new Date());
    commit(setTimeOnDate(base, hour24, minute));
  }

  function handleHourStep(delta: number) {
    const { hour12, period } = to12Hour(draftHour24);
    let nextHour12 = hour12 + delta;
    if (nextHour12 > 12) nextHour12 = 1;
    if (nextHour12 < 1) nextHour12 = 12;
    applyTime(to24Hour(nextHour12, period), draftMinute);
  }

  function handleMinuteStep(delta: number) {
    let next = draftMinute + delta * minuteStep;
    if (next > 59) next = 0;
    if (next < 0) next = 59;
    applyTime(draftHour24, next);
  }

  function handlePeriodToggle() {
    const { hour12, period } = to12Hour(draftHour24);
    const nextPeriod = period === 'AM' ? 'PM' : 'AM';
    applyTime(to24Hour(hour12, nextPeriod), draftMinute);
  }

  function handleHourInput(rawValue: string) {
    const parsed = clampNum(Number(rawValue) || 0, 0, 12);
    const { period } = to12Hour(draftHour24);
    applyTime(to24Hour(parsed === 0 ? 12 : parsed, period), draftMinute);
  }

  function handleMinuteInput(rawValue: string) {
    const parsed = clampNum(Number(rawValue) || 0, 0, 59);
    applyTime(draftHour24, parsed);
  }

  function goToday() {
    const today = new Date();
    setViewDate(today);
    if (mode === 'time') {
      applyTime(today.getHours(), today.getMinutes());
    } else {
      handleDayClick(today);
    }
  }

  function clearValue() {
    commit(null);
    if (mode !== 'time') setIsOpen(false);
  }

  const cells = useMemo(
    () => (showCalendar ? buildCalendarMatrix(viewDate) : []),
    [showCalendar, viewDate]
  );
  const { hour12, period } = to12Hour(draftHour24);

  const displayIcon =
    icon ??
    (mode === 'time' ? (
      <LuClock className="size-4" />
    ) : (
      <LuCalendar className="size-4" />
    ));
  const displayText = currentValue ?? '';

  const years = useMemo(() => {
    const centerYear = viewDate.getFullYear();
    const span = 12;
    return Array.from(
      { length: span },
      (_, i) => centerYear - Math.floor(span / 2) + i
    );
  }, [viewDate]);

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full', className)}
      {...divProps}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-invalid={ariaInvalid}
        data-slot="date-time-picker-trigger"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          inputVariants({ size }),
          'items-center gap-2',
          icon !== null && iconPosition === 'start' && !prefix && 'pl-10',
          icon !== null && iconPosition === 'end' && 'pr-10',
          prefix && 'gap-1.5'
        )}
      >
        {prefix && <span className="shrink-0 text-neutral-400">{prefix}</span>}
        <span className={cn('truncate', !displayText && 'text-neutral-400')}>
          {displayText ||
            placeholder ||
            (mode === 'time' ? 'Select time' : 'Select date')}
        </span>
        <input
          type="hidden"
          name={name}
          id={id}
          value={currentValue ?? ''}
          readOnly
        />
      </div>

      {icon !== null && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-400',
            iconPosition === 'start' && !prefix ? 'left-3' : 'right-3',
            prefix && iconPosition === 'start' && 'hidden'
          )}
        >
          {displayIcon}
        </span>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          className={cn(
            'absolute z-50 w-70 rounded-md border border-main bg-secondary-700 p-3 shadow-lg',
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
            panelClassName
          )}
        >
          {showCalendar && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setViewDate((d) => addMonths(d, -1))}
                  className="flex size-7 items-center justify-center rounded-md text-neutral-300 transition-colors hover:bg-secondary-600 hover:text-white"
                >
                  <LuChevronLeft className="size-4" />
                </button>

                <div className="flex items-center gap-1">
                  <select
                    aria-label="Month"
                    value={viewDate.getMonth()}
                    onChange={(e) =>
                      setViewDate(
                        (d) =>
                          new Date(d.getFullYear(), Number(e.target.value), 1)
                      )
                    }
                    className="cursor-pointer rounded-md bg-transparent px-1 py-0.5 text-sm font-medium text-white outline-none hover:bg-secondary-600"
                  >
                    {MONTH_LABELS.map((label, index) => (
                      <option
                        key={label}
                        value={index}
                        className="bg-secondary-700 text-white"
                      >
                        {label}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Year"
                    value={viewDate.getFullYear()}
                    onChange={(e) =>
                      setViewDate(
                        (d) => new Date(Number(e.target.value), d.getMonth(), 1)
                      )
                    }
                    className="cursor-pointer rounded-md bg-transparent px-1 py-0.5 text-sm font-medium text-white outline-none hover:bg-secondary-600"
                  >
                    {years.map((y) => (
                      <option
                        key={y}
                        value={y}
                        className="bg-secondary-700 text-white"
                      >
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setViewDate((d) => addMonths(d, 1))}
                  className="flex size-7 items-center justify-center rounded-md text-neutral-300 transition-colors hover:bg-secondary-600 hover:text-white"
                >
                  <LuChevronRight className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {DAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="text-[11px] font-medium text-neutral-400"
                  >
                    {label}
                  </div>
                ))}

                {cells.map(({ date, inMonth }) => {
                  const disabledCell = isDateDisabled(date, bounds);
                  const isSelected = selectedDate
                    ? isSameDay(date, selectedDate)
                    : false;
                  const isToday = isSameDay(date, new Date());

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={disabledCell}
                      onClick={() => handleDayClick(date)}
                      className={cn(
                        'mx-auto flex size-7 items-center justify-center rounded-full text-xs transition-colors',
                        inMonth ? 'text-white' : 'text-neutral-500',
                        !disabledCell &&
                          !isSelected &&
                          'hover:bg-secondary-600',
                        isToday &&
                          !isSelected &&
                          'ring-1 ring-inset ring-neutral-400',
                        isSelected &&
                          'bg-primary-500 text-white hover:bg-primary-500',
                        disabledCell && 'cursor-not-allowed opacity-30'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {showCalendar && showTime && <div className="my-3 h-px bg-main" />}

          {showTime && (
            <div className="flex items-center justify-center gap-2">
              <TimeField
                value={hour12}
                onStep={handleHourStep}
                onInput={handleHourInput}
                ariaLabel="Hour"
              />
              <span className="text-sm font-medium text-neutral-400">:</span>
              <TimeField
                value={draftMinute}
                onStep={handleMinuteStep}
                onInput={handleMinuteInput}
                ariaLabel="Minute"
              />
              <button
                type="button"
                onClick={handlePeriodToggle}
                aria-label="Toggle AM/PM"
                className="ml-1 rounded-md border border-main px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-secondary-600"
              >
                {period}
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-main pt-2">
            <button
              type="button"
              onClick={clearValue}
              className="text-xs font-medium text-neutral-400 transition-colors hover:text-white"
            >
              Clear
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToday}
                className="text-xs font-medium text-neutral-400 transition-colors hover:text-white"
              >
                Today
              </button>
              {(showTime || !shouldCloseOnSelect) && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md bg-primary-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary-500/90"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TimeFieldProps {
  value: number;
  onStep: (delta: number) => void;
  onInput: (rawValue: string) => void;
  ariaLabel: string;
}

/** A 2-digit number field with tiny up/down steppers, mirroring flatpickr's time inputs. */
function TimeField({ value, onStep, onInput, ariaLabel }: TimeFieldProps) {
  return (
    <div className="group flex items-center rounded-md border border-main bg-secondary-800/60">
      <input
        aria-label={ariaLabel}
        type="text"
        inputMode="numeric"
        value={String(value).padStart(2, '0')}
        onChange={(e) => onInput(e.target.value.replace(/\D/g, ''))}
        onWheel={(e) => onStep(e.deltaY < 0 ? 1 : -1)}
        className="w-8 bg-transparent py-1 text-center text-sm font-medium text-white outline-none"
      />
      <div className="flex flex-col opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Increase ${ariaLabel}`}
          onClick={() => onStep(1)}
          className="flex h-3 w-4 items-center justify-center text-neutral-400 hover:text-white"
        >
          <LuChevronUp className="size-3" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Decrease ${ariaLabel}`}
          onClick={() => onStep(-1)}
          className="flex h-3 w-4 items-center justify-center text-neutral-400 hover:text-white"
        >
          <LuChevronDown className="size-3" />
        </button>
      </div>
    </div>
  );
}

export { DateTimePicker, inputVariants as dateTimePickerInputVariants };
