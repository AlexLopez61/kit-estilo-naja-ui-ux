type Props = {
  name: string;
  value?: string;
  meta?: string;
};

export function TokenLabel({ name, value, meta }: Props) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <code className="font-mono text-xs text-text-secondary">{name}</code>
      {value && (
        <code className="font-mono text-[11px] leading-snug text-text-tertiary break-all">
          {value}
        </code>
      )}
      {meta && <span className="text-[11px] text-text-tertiary">{meta}</span>}
    </div>
  );
}
