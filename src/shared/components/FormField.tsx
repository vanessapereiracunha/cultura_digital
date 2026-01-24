import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
};

export function FormField({ label, children, error, className = "" }: FormFieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </label>
  );
}

