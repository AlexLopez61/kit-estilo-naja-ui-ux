import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div
      data-slot="page-container"
      className={cn('mx-auto w-full max-w-[1700px] space-y-6 p-6 md:p-8', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { PageContainer };
