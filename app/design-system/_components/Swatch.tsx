import { TokenLabel } from './TokenLabel';

export type SwatchVariant = 'fill' | 'border' | 'text';

type Props = {
  name: string;
  value: string;
  cssVar: string;
  variant?: SwatchVariant;
};

export function Swatch({ name, value, cssVar, variant = 'fill' }: Props) {
  return (
    <div className="flex w-[160px] flex-col gap-2.5">
      <SwatchPreview cssVar={cssVar} variant={variant} />
      <TokenLabel name={name} value={value} />
    </div>
  );
}

function SwatchPreview({ cssVar, variant }: { cssVar: string; variant: SwatchVariant }) {
  if (variant === 'border') {
    return (
      <div
        className="h-20 w-20 rounded-md bg-bg-surface"
        style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: `var(${cssVar})` }}
      />
    );
  }
  if (variant === 'text') {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-md border border-border-subtle bg-bg-elevated">
        <span
          className="text-2xl tracking-[-0.01em]"
          style={{ color: `var(${cssVar})`, fontWeight: 500 }}
        >
          Aa
        </span>
      </div>
    );
  }
  return (
    <div
      className="h-20 w-20 rounded-md border border-border-subtle"
      style={{ backgroundColor: `var(${cssVar})` }}
    />
  );
}
