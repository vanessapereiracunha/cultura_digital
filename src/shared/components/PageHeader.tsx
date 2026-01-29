import type { ReactNode } from "react";
import { Button } from "./Button";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, onBack, backLabel = "Voltar", actions }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h5 className="m-0 text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">{title}</h5>
        <div className="flex items-center gap-3 flex-wrap">
          {actions}
          {onBack && (
            <Button variant="outline" onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />}>
              {backLabel}
            </Button>
          )}
        </div>
      </div>
      {subtitle && <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">{subtitle}</p>}
    </header>
  );
}
