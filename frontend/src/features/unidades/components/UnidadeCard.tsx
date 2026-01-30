import type { Unidade, UnidadeStatus } from "../models";
import { Button } from "../../../shared/components/Button";
import { FolderOpen, Trash2 } from "lucide-react";

type UnidadeCardActions = {
  onSelect?: () => void;
  onDelete?: () => void;
};

type UnidadeCardProps = {
  unidade: Unidade;
  status?: UnidadeStatus;
  actions?: UnidadeCardActions;
};

export function UnidadeCard({ unidade, status = "pendente", actions }: UnidadeCardProps) {

  const statusStyle: Record<UnidadeStatus, string> = {
    pendente: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    andamento: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100",
    concluida: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100",
  };

  return (
    <article className="mb-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <h6 className="m-0 text-base font-semibold text-slate-900 dark:text-white truncate">{unidade.nome}</h6>
          {unidade.origem === "ia" && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/20 dark:text-brand-100">IA</span>
          )}
        </div>
        {unidade.descricao && <p className="m-0 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{unidade.descricao}</p>}
      </div>
      <nav className="flex flex-col gap-2 sm:ml-4 sm:flex-row sm:items-center sm:flex-nowrap">
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyle[status]}`}>
          {status === "pendente" ? "Pendente" : status === "andamento" ? "Em andamento" : "Concluída"}
        </span>
        <Button 
          variant="outline" 
          size="md"
          onClick={() => actions?.onSelect?.()}
          icon={<FolderOpen className="h-5 w-5" />}
          className="flex-1 min-w-0 justify-center sm:flex-none sm:min-w-[140px] sm:px-5"
        >
          <span className="truncate">Materiais</span>
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
