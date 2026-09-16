import { ReactNode } from 'react';

type Props = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ id, title, description, children }: Props) {
  return (
    <section id={id} className="border-t border-border-subtle scroll-mt-6">
      <div className="mx-auto max-w-screen-2xl px-6 py-14">
        <header className="mb-10">
          <h2 className="text-2xl font-semibold tracking-[-0.01em] text-text-primary">{title}</h2>
          {description && (
            <p className="mt-2 max-w-3xl text-sm text-text-secondary">{description}</p>
          )}
        </header>
        <div className="space-y-14">{children}</div>
      </div>
    </section>
  );
}
