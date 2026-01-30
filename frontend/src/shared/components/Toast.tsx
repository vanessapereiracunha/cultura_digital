import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
};

export function Toast({ message, type = "success", duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const styles = {
    success: "bg-emerald-500 text-white shadow-emerald-900/30",
    error: "bg-rose-500 text-white shadow-rose-900/30",
    info: "bg-slate-800 text-white shadow-slate-900/30 border border-white/10",
  }[type];

  const icons = {
    success: <CheckCircle2 className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  }[type];

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-floating ${styles}`}>
        <span>{icons}</span>
        <p className="m-0 text-sm font-medium leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="ml-1 text-white/80 transition hover:text-white focus:outline-none"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
