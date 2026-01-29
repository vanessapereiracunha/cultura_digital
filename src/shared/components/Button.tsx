import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger" | "fill" | "transparent" | "border";
  size?: "sm" | "md" | "lg" | "icon";
  icon?: ReactNode;
  loading?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {

  const variantMap: Record<string, string> = {
    fill: "primary",
    transparent: "ghost",
    border: "outline",
    primary: "primary",
    outline: "outline",
    ghost: "ghost",
    danger: "danger"
  };

  const activeVariant = variantMap[variant] || "primary";

  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-brand-400 shadow-md dark:bg-brand-500 dark:hover:bg-brand-400 dark:shadow-brand-900/30",
    outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-50 dark:hover:border-brand-400",
    ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-200 dark:text-slate-200 dark:hover:bg-white/5 dark:focus-visible:ring-white/20",
    danger: "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-400 shadow-md dark:shadow-rose-900/30",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10 p-2", // For buttons that are just icons
  };

  const computedSize = (className.includes("circle") || !children) ? "icon" : size;

  return (
    <button
      className={`${baseStyles} ${variants[activeVariant as keyof typeof variants]} ${sizes[computedSize]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className={children ? "mr-2" : ""}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
