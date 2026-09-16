'use client';

/**
 * WizardModal — modal multi-paso genérico. Recibe `steps` ({ title, content,
 * isValid? }) y maneja el paso activo, el stepper del header, el footer dinámico
 * y una transición corta (fade + slide) entre pasos.
 *
 * No es dismissable por click-fuera/Esc (flujo guiado); el × del header sigue
 * disponible como salida explícita. `Siguiente` se deshabilita si el paso
 * actual reporta `isValid === false`.
 */

import * as React from 'react';
import { Check, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NajaModal } from '@/components/ui/naja-modal';
import { cn } from '@/lib/utils';

export type WizardStep = {
  title: string;
  content: React.ReactNode;
  /** Si es `false`, deshabilita avanzar desde este paso. Default válido. */
  isValid?: boolean;
};

export function WizardModal({
  open,
  onOpenChange,
  title,
  icon,
  steps,
  finishLabel = 'Finalizar',
  onFinish,
  size = 'md',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  icon?: LucideIcon;
  steps: WizardStep[];
  finishLabel?: string;
  onFinish?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}) {
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [wasOpen, setWasOpen] = React.useState(open);

  // Reinicia al abrir, sin esperar a un efecto.
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setStep(0);
      setDir(1);
    }
  }

  const isFirst = step === 0;
  const isLast = step === steps.length - 1;
  const canAdvance = steps[step]?.isValid !== false;

  function next() {
    setDir(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }
  function finish() {
    onFinish?.();
    onOpenChange(false);
  }

  return (
    <NajaModal
      open={open}
      onOpenChange={onOpenChange}
      icon={icon}
      title={title}
      dismissable={false}
      size={size}
      headerAddon={<Stepper steps={steps} current={step} />}
      footer={
        <>
          {isFirst ? (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={back}>
              <ChevronLeft className="size-4" strokeWidth={1.5} />
              Atrás
            </Button>
          )}
          {isLast ? (
            <Button type="button" onClick={finish} disabled={!canAdvance}>
              {finishLabel}
            </Button>
          ) : (
            <Button type="button" onClick={next} disabled={!canAdvance}>
              Siguiente
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </Button>
          )}
        </>
      }
    >
      <div
        key={step}
        className={cn(
          'animate-in fade-in-0 duration-200',
          dir === 1 ? 'slide-in-from-right-3' : 'slide-in-from-left-3',
        )}
      >
        {steps[step]?.content}
      </div>
    </NajaModal>
  );
}

function Stepper({ steps, current }: { steps: WizardStep[]; current: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.title}>
            <li className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs tabular-nums transition-colors',
                  active && 'bg-primary text-primary-foreground',
                  done && 'bg-primary/10 text-primary',
                  !active && !done && 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={1.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-xs',
                  active || done ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {s.title}
              </span>
            </li>
            {i < steps.length - 1 && (
              <span className={cn('mx-2 h-px flex-1', done ? 'bg-primary/40' : 'bg-border')} />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}
