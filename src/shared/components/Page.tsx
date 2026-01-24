import type { ReactNode } from "react";

type PageProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Page({ title, subtitle, actions, children }: PageProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </header>
      
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}


