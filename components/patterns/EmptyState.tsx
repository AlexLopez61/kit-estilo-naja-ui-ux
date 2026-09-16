import * as React from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends React.ComponentProps<typeof Empty> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'error';
}

function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Empty data-variant={variant} className={cn('min-h-[400px]', className)} {...props}>
      <EmptyHeader>
        {icon && (
          <EmptyMedia
            variant="icon"
            className={variant === 'error' ? 'bg-destructive/10 text-destructive' : undefined}
          >
            {icon}
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}

export { EmptyState };
