import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  isLoading?: boolean;
};

export function Button({ variant = "primary", children, isLoading, disabled, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-none focus:ring-slate-400",
    outline: "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus:ring-red-500 hover:border-red-300",
  };

  const className = `${base} ${variants[variant]} ${rest.className ?? ""}`.trim();

  return (
    <button {...rest} disabled={disabled || isLoading} className={className}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

