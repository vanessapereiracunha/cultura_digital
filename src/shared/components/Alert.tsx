import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

type AlertProps = {
  type?: "info" | "success" | "warning" | "error" | "primary";
  title?: string;
  children: ReactNode;
  icon?: string;
  className?: string;
};

export function Alert({ type = "info", title, children, icon, className = "" }: AlertProps) {
  const variants = {
    info: "border border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/30 dark:bg-blue-50/10 dark:text-blue-100",
    success: "border border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-50/10 dark:text-emerald-100",
    warning: "border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-50/10 dark:text-amber-100",
    error: "border border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-400/30 dark:bg-rose-50/10 dark:text-rose-100",
    primary: "border border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-50",
  };

  const icons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5" />,
    warning: <TriangleAlert className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    primary: <Info className="h-5 w-5" />,
  };

  return (
    <article className={`flex gap-3 rounded-xl px-4 py-3 text-sm ${variants[type]} ${className}`}>
      <span className="mt-0.5 text-inherit">{icon || icons[type]}</span>
      <div className="space-y-1 text-inherit">
        {title && <h6 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">{title}</h6>}
        <div className="leading-relaxed text-slate-800 dark:text-slate-100">{children}</div>
      </div>
    </article>
  );
}
