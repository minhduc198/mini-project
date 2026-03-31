'use client';

import { format, isValid, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Calendar } from '@/src/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import type { DayButton } from 'react-day-picker';

interface DatePickerProps {
  value?: string;
  onChange?: (iso: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const parsed = value ? parseISO(value) : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;
  const display = selected ? format(selected, 'dd MMM yyyy') : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={`w-full flex items-center gap-2 bg-white/[0.04] border rounded-lg px-3 py-2 text-xs transition-colors text-left h-auto font-normal justify-start
            ${selected ? 'border-white/[0.07] hover:border-white/20' : 'border-white/[0.07] hover:border-white/20'}
            ${display ? 'text-white/80' : 'text-white/25'}
            ${className ?? ''}`}>
          <CalendarDays size={13} className={display ? 'text-violet-400' : 'text-white/20'} />
          {display ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border border-white/[0.08] bg-[#0F0F1C] shadow-2xl shadow-black/60" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d: Date | undefined) => {
            if (d) onChange?.(d.toISOString());
          }}
          defaultMonth={selected}
          classNames={{
            months: 'flex flex-col',
            month: 'flex flex-col gap-4 p-4',
            nav: 'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-4 pt-4',
            button_previous:
              'w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors border-0',
            button_next:
              'w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors border-0',
            month_caption: 'flex h-7 w-full items-center justify-center text-xs font-medium text-white/70',
            caption_label: 'text-xs font-medium text-white/70',
            weekdays: 'flex',
            weekday: 'flex-1 text-center text-[10px] text-white/20 py-1 uppercase tracking-wider font-normal',
            week: 'mt-1 flex w-full',
            day: 'group/day relative aspect-square h-full w-full p-0 text-center select-none',
            today: 'rounded-lg border border-violet-500/40 text-violet-300',
            outside: 'text-white/20 opacity-40',
            disabled: 'text-white/20 opacity-30',
            hidden: 'invisible',
          }}
          components={{
            DayButton: ({ day, modifiers, className, ...props }: React.ComponentProps<typeof DayButton>) => {
              const isSelected = modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;
              const isToday = modifiers.today;

              return (
                <Button
                  {...props}
                  variant="ghost"
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs transition-all flex items-center justify-center mx-auto h-8 min-h-8 p-0 font-normal',
                    isSelected
                      ? 'bg-violet-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:bg-violet-500 hover:text-white'
                      : isToday
                        ? 'border border-violet-500/40 text-violet-300'
                        : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80',
                    className,
                  )}
                />
              );
            },
          }}
        />

        <div className="px-4 pb-3 pt-0 border-t border-white/[0.06] flex justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange?.(new Date().toISOString())}
            className="text-[11px] text-violet-400 hover:text-violet-300 px-2.5 py-1 rounded-md hover:bg-violet-500/10 transition-colors h-auto font-normal">
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function DatePickerField({ name, label, placeholder }: DatePickerFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <DatePicker value={field.value ?? ''} onChange={field.onChange} placeholder={placeholder} />}
      />
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
