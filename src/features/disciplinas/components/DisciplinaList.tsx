import type { Disciplina } from "../models";
import { DisciplinaCard } from "./DisciplinaCard";
import { EmptyState } from "../../../shared/components/EmptyState";
import { School } from "lucide-react";

type DisciplinaListProps = {
  disciplinas: Disciplina[];
  onSelectDisciplina?: (disciplina: Disciplina) => void;
  onDeleteDisciplina?: (disciplina: Disciplina) => void;
};

export function DisciplinaList({ disciplinas, onSelectDisciplina, onDeleteDisciplina }: DisciplinaListProps) {
  if (disciplinas.length === 0) {
    return (
      <EmptyState
        icon={<School className="h-8 w-8 text-slate-600 dark:text-slate-200" />}
        title="Nenhuma disciplina encontrada"
        description="Clique em 'Criar disciplina' para começar."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {disciplinas.map((disciplina) => (
        <DisciplinaCard
          key={disciplina.id}
          disciplina={disciplina}
          actions={{
            onSelect: onSelectDisciplina ? () => onSelectDisciplina(disciplina) : undefined,
            onDelete: onDeleteDisciplina ? () => onDeleteDisciplina(disciplina) : undefined,
          }}
        />
      ))}
    </div>
  );
}
