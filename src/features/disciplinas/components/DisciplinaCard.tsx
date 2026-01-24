import { Trash2 } from "lucide-react";
import type { Disciplina } from "../models";

type DisciplinaCardProps = {
  disciplina: Disciplina;
  onSelect?: (disciplina: Disciplina) => void;
  onDelete?: (disciplina: Disciplina) => void;
};

export function DisciplinaCard({ disciplina, onSelect, onDelete }: DisciplinaCardProps) {
  return (
    <div className="group relative border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
      <button
        type="button"
        onClick={() => onSelect?.(disciplina)}
        className="w-full text-left focus:outline-none"
      >
        <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
          {disciplina.nome}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded-full">
          {disciplina.serieAno}
        </div>
        {disciplina.assunto && (
          <div className="text-xs text-slate-500 mt-1 ml-2 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded-full">
            {disciplina.assunto}
          </div>
        )}
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(disciplina);
          }}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          title="Excluir disciplina"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

