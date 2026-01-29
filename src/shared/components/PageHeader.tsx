import type { ReactNode } from "react";
import { Button } from "./Button";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, onBack, backLabel = "Voltar", actions }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h5 className="m-0 text-3xl font-semibold text-slate-900 dark:text-white">{title}</h5>
        <div className="flex items-center gap-3">
          {actions}
          {onBack && (
            <Button variant="outline" onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />}>
              {backLabel}
            </Button>
          )}
        </div>
      </div>
      {subtitle && <p className="text-lg text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </header>
  );
}
