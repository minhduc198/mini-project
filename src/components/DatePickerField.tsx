"use client";

import {
  format,
  isValid,
  parseISO,
  getDaysInMonth,
  startOfMonth,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface DatePickerProps {
  value?: string;
  onChange?: (iso: string) => void;
  placeholder?: string;
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CalendarPopover({
  selected,
  onSelect,
  onClose,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const [view, setView] = useState(() => selected ?? new Date());

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = getDaysInMonth(view);
  const firstDow = getDay(startOfMonth(view));

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (d: number) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d;

  const isToday = (d: number) => {
    const t = new Date();
    return (
      t.getFullYear() === year && t.getMonth() === month && t.getDate() === d
    );
  };

  return (
    <div
      className="absolute z-50 mt-1 w-72 rounded-xl border border-white/[0.08] bg-[#0F0F1C] shadow-2xl shadow-black/60 p-4"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setView(subMonths(view, 1))}
          className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-medium text-white/70">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setView(addMonths(view, 1))}
          className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/6 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-white/20 py-1 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                onClick={() => {
                  onSelect(new Date(year, month, day));
                  onClose();
                }}
                className={`w-8 h-8 rounded-lg text-xs transition-all
                  ${
                    isSelected(day)
                      ? "bg-violet-500 text-white font-semibold shadow-lg shadow-violet-500/30"
                      : isToday(day)
                        ? "border border-violet-500/40 text-violet-300"
                        : "text-white/50 hover:bg-white/6 hover:text-white/80"
                  }`}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Today shortcut */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-end">
        <button
          onClick={() => {
            onSelect(new Date());
            onClose();
          }}
          className="text-[11px] text-violet-400 hover:text-violet-300 px-2.5 py-1 rounded-md hover:bg-violet-500/10 transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parsed = value ? parseISO(value) : null;
  const display =
    parsed && isValid(parsed) ? format(parsed, "dd MMM yyyy") : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2 bg-white/[0.04] border rounded-lg px-3 py-2 text-xs transition-colors text-left
          ${open ? "border-violet-500/50 bg-white/[0.06]" : "border-white/[0.07] hover:border-white/20"}
          ${display ? "text-white/80" : "text-white/25"}`}
      >
        <CalendarDays
          size={13}
          className={display ? "text-violet-400" : "text-white/20"}
        />
        {display ?? placeholder}
      </button>

      {open && (
        <CalendarPopover
          selected={parsed && isValid(parsed) ? parsed : null}
          onSelect={(d) => onChange?.(d.toISOString())}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

interface DatePickerFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function DatePickerField({
  name,
  label,
  placeholder,
}: DatePickerFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        )}
      />
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
