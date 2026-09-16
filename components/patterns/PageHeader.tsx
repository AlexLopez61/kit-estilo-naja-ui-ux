import * as React from 'react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

interface BreadcrumbItemData {
  label: string;
  href?: React.ComponentProps<typeof Link>['href'];
}

interface PageHeaderProps {
  breadcrumb?: BreadcrumbItemData[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

function PageHeader({ breadcrumb, title, description, actions, className }: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn('mb-6', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            {breadcrumb.map((item, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              return (
                <React.Fragment key={`${item.label}-${idx}`}>
                  <BreadcrumbItem>
                    {item.href && !isLast ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export { PageHeader };
