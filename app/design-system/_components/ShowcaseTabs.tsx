'use client';

import { ReactNode } from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

type Item = {
  value: string;
  label: string;
  content: ReactNode;
};

type Props = {
  defaultValue: string;
  items: Item[];
};

export function ShowcaseTabs({ defaultValue, items }: Props) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue}>
      <TabsPrimitive.List className="flex gap-6 border-b border-border-subtle">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              '-mb-px cursor-pointer border-b-2 border-transparent px-3 py-2 text-sm font-medium',
              'text-text-secondary transition-colors duration-150',
              'hover:text-text-primary',
              'focus-visible:text-text-primary focus-visible:outline-none',
              'data-[state=active]:border-foreground data-[state=active]:text-text-primary',
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="pt-4 text-sm text-text-secondary"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
