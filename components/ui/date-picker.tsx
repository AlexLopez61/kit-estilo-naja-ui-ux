'use client';

import * as React from 'react';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DatePickerProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  /**
   * Restringe los días del mes seleccionables (e.g. [1, 5, 10, 15, 20, 25]
   * para días de cobro de pagarés). Si se pasa, solo esos días son clickeables.
   */
  allowedDaysOfMonth?: readonly number[];
  ['aria-invalid']?: boolean;
  ['aria-describedby']?: string;
};

function parseIsoDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return isValid(date) ? date : undefined;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function DatePicker({
  id,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  min,
  max,
  disabled,
  placeholder = 'Selecciona fecha',
  required,
  className,
  align = 'start',
  allowedDaysOfMonth,
  ...aria
}: DatePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue ?? '');
  const [open, setOpen] = React.useState(false);

  const value = isControlled ? (controlledValue ?? '') : internalValue;
  const selected = parseIsoDate(value);
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);

  function handleSelect(date: Date | undefined) {
    const next = date ? toIsoDate(date) : '';
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
    if (date) setOpen(false);
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={value} required={required} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={aria['aria-invalid']}
            aria-describedby={aria['aria-describedby']}
            className={cn(
              'h-9 w-full justify-start px-3 font-normal',
              !selected && 'text-text-disabled',
              className,
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 opacity-60" />
            {selected ? (
              <span className="truncate">{format(selected, 'dd/MM/yyyy', { locale: es })}</span>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} className="w-auto p-0">
          <Calendar
            mode="single"
            locale={es}
            selected={selected}
            defaultMonth={selected ?? maxDate ?? minDate}
            onSelect={handleSelect}
            disabled={
              minDate || maxDate || allowedDaysOfMonth
                ? (date) => {
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    if (allowedDaysOfMonth && !allowedDaysOfMonth.includes(date.getDate()))
                      return true;
                    return false;
                  }
                : undefined
            }
            captionLayout="dropdown"
            // Rango amplio del dropdown de año para soportar contratos de
            // varios años hacia atrás y adelante. El `disabled` sigue
            // aplicando min/max si vienen como prop.
            startMonth={minDate ?? new Date(2020, 0, 1)}
            endMonth={maxDate ?? new Date(2050, 11, 31)}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

export { parseIsoDate, toIsoDate };
