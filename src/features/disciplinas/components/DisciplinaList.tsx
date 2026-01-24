import type { Disciplina } from "../models";
import { DisciplinaCard } from "./DisciplinaCard";

type DisciplinaListProps = {
  disciplinas: Disciplina[];
  onSelectDisciplina?: (disciplina: Disciplina) => void;
  onDeleteDisciplina?: (disciplina: Disciplina) => void;
};

export function DisciplinaList({ disciplinas, onSelectDisciplina, onDeleteDisciplina }: DisciplinaListProps) {
  if (disciplinas.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">Nenhuma disciplina encontrada.</p>
        <p className="text-sm text-slate-400 mt-1">Clique em "Criar disciplina" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {disciplinas.map((disciplina) => (
        <DisciplinaCard
          key={disciplina.id}
          disciplina={disciplina}
          onSelect={onSelectDisciplina}
          onDelete={onDeleteDisciplina}
        />
      ))}
    </div>
  );
}

