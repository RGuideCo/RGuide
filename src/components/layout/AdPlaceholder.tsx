interface AdPlaceholderProps {
  label?: string;
  className?: string;
}

export function AdPlaceholder({
  label = "Ad Placeholder",
  className = "",
}: AdPlaceholderProps) {
  return (
    <aside
      className={`surface flex min-h-28 items-center justify-center border-dashed border-slate-300/80 bg-stone-100/70 text-center text-sm text-slate-500 ${className}`}
      aria-label={label}
    >
      <div>
        <p className="font-medium uppercase tracking-[0.24em] text-slate-400">{label}</p>
        <p className="mt-2 max-w-md text-balance">
          Reserved for future monetization without disrupting core content flow.
        </p>
      </div>
    </aside>
  );
}
