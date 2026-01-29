import type { Unidade } from "../models";
import { Button } from "../../../shared/components/Button";
import { FolderOpen, Trash2 } from "lucide-react";

type UnidadeCardActions = {
  onSelect?: () => void;
  onDelete?: () => void;
};

type UnidadeCardProps = {
  unidade: Unidade;
  actions?: UnidadeCardActions;
};

export function UnidadeCard({ unidade, actions }: UnidadeCardProps) {
  return (
    <article className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h6 className="m-0 text-base font-semibold text-slate-900 dark:text-white">{unidade.nome}</h6>
          {unidade.origem === "ia" && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/20 dark:text-brand-100">IA</span>
          )}
        </div>
        {unidade.descricao && <p className="m-0 text-sm text-slate-600 dark:text-slate-300">{unidade.descricao}</p>}
      </div>
      <nav className="ml-4 flex items-center gap-2">
        <Button 
          variant="outline" 
          size="md"
          onClick={() => actions?.onSelect?.()}
          icon={<FolderOpen className="h-5 w-5" />}
        >
          Materiais
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300" 
          onClick={() => actions?.onDelete?.()}
          icon={<Trash2 className="h-5 w-5" />}
        />
      </nav>
    </article>
  );
}
