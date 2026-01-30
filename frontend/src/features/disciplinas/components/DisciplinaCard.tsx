import type { Disciplina } from "../models";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Trash2, Book } from "lucide-react";

type DisciplinaCardActions = {
  onSelect?: () => void;
  onDelete?: () => void;
};

type DisciplinaCardProps = {
  disciplina: Disciplina;
  actions?: DisciplinaCardActions;
};

export function DisciplinaCard({ disciplina, actions }: DisciplinaCardProps) {
  return (
    <Card 
      className="cursor-pointer transition hover:border-brand-400/40 hover:shadow-floating" 
      onClick={() => actions?.onSelect?.()}
      icon={<Book className="h-6 w-6 text-slate-900 dark:text-white" aria-hidden />}
      actions={
        actions?.onDelete && (
          <Button 
            variant="ghost"
            size="icon"
            className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300"
            onClick={(e) => {
              e.stopPropagation();
              actions.onDelete?.();
            }}
            title="Excluir disciplina"
            icon={<Trash2 className="h-6 w-6" />}
         />
       )
     }
    >
      <h5 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{disciplina.nome}</h5>
      <div className="flex gap-2">
        <div className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">{disciplina.serieAno}</div>
        {disciplina.assunto && (
          <div className="rounded bg-brand-50 px-2 py-1 text-xs text-brand-700 ring-1 ring-brand-100 dark:bg-brand-500/20 dark:text-brand-100 dark:ring-brand-400/30">{disciplina.assunto}</div>
        )}
      </div>
    </Card>
  );
}