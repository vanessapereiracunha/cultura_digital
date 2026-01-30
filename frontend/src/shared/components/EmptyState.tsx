import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
      {icon && <div className="mb-1 text-brand-500 dark:text-brand-200">{icon}</div>}
      <h5 className="m-0 text-lg font-semibold text-slate-900 dark:text-white">{title}</h5>
      {description && <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
