import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
  className?: string;
  error?: string;
};

function FieldWrapper({ label, children, className = "", error }: FieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-1 mb-3 ${className}`}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {children}
      {error && <span className="text-xs text-rose-500 dark:text-rose-400">{error}</span>}
    </div>
  );
}

export function Input({ label, className = "", error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <FieldWrapper label={label} className={className} error={error}>
      <input
        className="block w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-50"
        {...props}
      />
    </FieldWrapper>
  );
}

export function Textarea({ label, className = "", error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <FieldWrapper label={label} className={className} error={error}>
      <textarea
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-50"
        {...props}
      />
    </FieldWrapper>
  );
}

export function Select({ label, children, className = "", error, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <FieldWrapper label={label} className={className} error={error}>
      <select
        className="block w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-50"
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
