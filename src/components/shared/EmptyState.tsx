interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="surface px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">{description}</p>
    </div>
  );
}
