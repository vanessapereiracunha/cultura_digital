import type { ReactNode, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

export function Card({ title, icon, children, actions, className = "", ...props }: CardProps) {
  return (
    <article className={`rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-floating ${className}`} {...props}>
      {(title || icon || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 dark:border-white/5 sm:flex-row sm:items-center">
          {icon && <span className="flex items-center justify-center text-slate-700 dark:text-white">{icon}</span>}
          {title && <h5 className="m-0 flex-1 text-lg font-semibold text-slate-900 dark:text-white">{title}</h5>}
          {actions && <div className="ml-auto flex w-full flex-wrap justify-end gap-2 sm:w-auto sm:flex-nowrap">{actions}</div>}
        </div>
      )}
      <div className="p-6 text-slate-800 dark:text-slate-100">
        {children}
      </div>
    </article>
  );
}
