'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useId, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxOption = { value: string; label: string; hint?: string };

type Props = {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  defaultValue?: string;
  className?: string;
};

/**
 * Combobox reconstruido sobre cmdk (Command) + Popover. Trigger con valor
 * seleccionado o placeholder, búsqueda filtrada y check en la opción activa.
 */
export function ShowcaseCombobox({
  options,
  placeholder = 'Selecciona…',
  searchPlaceholder = 'Buscar…',
  emptyText = 'Sin resultados.',
  defaultValue = '',
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border-default bg-bg-surface px-3 text-sm outline-none transition-colors hover:bg-bg-elevated focus-visible:border-ring/50 focus-visible:shadow-focus',
            selected ? 'text-text-primary' : 'text-text-disabled',
            className,
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList id={listId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    setValue(opt.value === value ? '' : opt.value);
                    setOpen(false);
                  }}
                >
                  <span className="flex-1 truncate">
                    {opt.label}
                    {opt.hint && (
                      <span className="ml-2 text-xs text-text-tertiary">{opt.hint}</span>
                    )}
                  </span>
                  <Check
                    className={cn(
                      'size-4 text-text-primary',
                      opt.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                    strokeWidth={1.5}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
