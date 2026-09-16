'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = 'all';

export type FilterOption = {
  value: string;
  label: string;
  /** Avatar a la izquierda del label (foto con fallback a iniciales).
   *  `square` para entidades no-persona (propiedades, unidades). */
  avatar?: { name: string; src?: string | null; square?: boolean };
  /** Mini-pill emerald junto al label (ej. "Actual" en el mes corriente). */
  tag?: string;
};

function OptionTag({ tag }: { tag: string }) {
  return (
    <span className="rounded-sm bg-brand-subtle px-1.5 py-px text-[10px] leading-4 text-brand-text">
      {tag}
    </span>
  );
}

/**
 * Select compacto para filas de filtros inline (estilo Materiales/Contratos):
 * label a la izquierda + Select sm. `value === undefined` significa "todos".
 */
export function FilterSelect({
  label,
  allLabel,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  allLabel: string;
  options: FilterOption[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="text-text-tertiary text-xs">{label}</span>
      <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
        <SelectTrigger size="sm" className="h-8 max-w-44 min-w-32">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} textValue={o.label}>
              {o.avatar && <OptionAvatar avatar={o.avatar} size={20} />}
              {o.label}
              {o.tag && <OptionTag tag={o.tag} />}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Variante combobox del FilterSelect: mismo layout compacto, pero el dropdown
 * trae buscador por escritura (cmdk) y avatares en las opciones. Para listas
 * largas (propiedades, unidades, inquilinos).
 */
export function FilterCombobox({
  label,
  allLabel,
  options,
  value,
  onChange,
  searchPlaceholder = 'Buscar…',
  className,
}: {
  label: string;
  allLabel: string;
  options: FilterOption[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  searchPlaceholder?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  function pick(v: string | undefined) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="text-text-tertiary text-xs">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 max-w-44 min-w-32 justify-between px-2.5 font-normal"
          >
            <span className="flex min-w-0 items-center gap-1.5">
              {selected?.avatar && <OptionAvatar avatar={selected.avatar} size={18} />}
              <span className="truncate">{selected ? selected.label : allLabel}</span>
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-text-tertiary" strokeWidth={1.5} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-60 p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-64">
              <CommandEmpty>Sin resultados.</CommandEmpty>
              <CommandGroup>
                <CommandItem value={`__${allLabel}__`} onSelect={() => pick(undefined)}>
                  <Check
                    className={cn('size-4', value === undefined ? 'opacity-100' : 'opacity-0')}
                  />
                  {allLabel}
                </CommandItem>
                {options.map((o) => (
                  <CommandItem key={o.value} value={o.label} onSelect={() => pick(o.value)}>
                    <Check
                      className={cn('size-4', o.value === value ? 'opacity-100' : 'opacity-0')}
                    />
                    {o.avatar && <OptionAvatar avatar={o.avatar} size={20} />}
                    {o.label}
                    {o.tag && <OptionTag tag={o.tag} />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function OptionAvatar({
  avatar,
  size,
}: {
  avatar: NonNullable<FilterOption['avatar']>;
  size: number;
}) {
  return (
    <Avatar
      name={avatar.name}
      src={avatar.src ?? undefined}
      size={size}
      square={avatar.square}
      tone={avatar.square ? 'neutral' : undefined}
    />
  );
}
