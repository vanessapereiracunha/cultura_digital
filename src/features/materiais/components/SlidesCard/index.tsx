import { useState } from "react";
import type { Slide } from "../../models";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";
import { EmptyState } from "../../../../shared/components/EmptyState";
import { ConfirmDialog } from "../../../../shared/components/ConfirmDialog";
import { Presentation, Sparkles, CheckCircle2 } from "lucide-react";
import { SlidesActions } from "./Actions";
import { SlidesDisplay } from "./Display";

type SlidesCardProps = {
  unidade: { id: string; nome: string };
  slides: Slide | null;
  loading: boolean;
  onGenerate: () => void;
  onDelete: () => void;
  onStatusChange: (status: "andamento" | "concluida") => void;
};

export function SlidesCard({ unidade, slides, loading, onGenerate, onDelete, onStatusChange }: SlidesCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!slides) {
    return (
      <Card title="Slides" icon={<Presentation className="h-6 w-6" />}>
        <EmptyState
          title="Nenhum slide gerado"
          description="Gere uma apresentação de slides automática."
          action={
            <Button onClick={onGenerate} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
              Gerar Slides
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title="Slides"
      icon={<Presentation className="h-6 w-6 text-slate-900 dark:text-white" />}
      actions={<SlidesActions slides={slides} onDelete={() => setConfirmDelete(true)} />}
    >
      <SlidesDisplay unidadeNome={unidade.nome} />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Gerado com sucesso
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange("concluida")}
            className={
              slides.status === "concluida"
                ? "border-transparent bg-emerald-500 text-white shadow-sm hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            }
          >
            Concluído
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange("andamento")}
            className={
              slides.status === "andamento" || !slides.status
                ? "border-transparent bg-orange-500 text-white shadow-sm hover:bg-orange-400 dark:bg-orange-400 dark:hover:bg-orange-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            }
          >
            Em andamento
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Remover slides?"
        description="Isso apagará os slides gerados para esta unidade."
        confirmLabel="Remover"
        onConfirm={() => {
          onDelete();
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </Card>
  );
}

export default SlidesCard;
