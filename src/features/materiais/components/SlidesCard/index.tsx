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
};

export function SlidesCard({ unidade, slides, loading, onGenerate, onDelete }: SlidesCardProps) {
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

      <div className="mt-4 flex items-center justify-end gap-2 text-emerald-300">
        <CheckCircle2 className="h-4 w-4" /> Gerado com sucesso
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
