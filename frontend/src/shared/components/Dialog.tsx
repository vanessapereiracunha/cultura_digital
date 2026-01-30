import { type ReactNode, useEffect, useRef } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Dialog({ open, title, children, actions, onClose, className = "" }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`backdrop:bg-black/60 w-[520px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 ${className}`}
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <h5 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h5>
      <div className="space-y-4 text-slate-800 dark:text-slate-100">
        {children}
      </div>
      {actions && (
        <nav className="mt-6 flex items-center justify-end gap-3">
          {actions}
        </nav>
      )}
    </dialog>
  );
}1
