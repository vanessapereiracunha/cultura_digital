import { useState } from "react";
import type { PlanoDeAula, LessonPlanContent } from "../../models";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";
import { EmptyState } from "../../../../shared/components/EmptyState";
import { FileText, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { ConfirmDialog } from "../../../../shared/components/ConfirmDialog";
import { buildLessonPlanHtml } from "../../../../shared/utils/materialExport";
import { LessonPlanDisplay } from "./Display";
import { LessonPlanEditForm } from "./EditForm";
import { LessonPlanActions } from "./Actions";

type PlanoAulaCardProps = {
  unidade: { id: string; nome: string; descricao?: string };
  disciplina: { nome: string; serieAno: string };
  plano: PlanoDeAula | null;
  loading: boolean;
  onGenerate: () => void;
  onSave: (conteudo: LessonPlanContent) => void;
  onDelete: () => void;
};

export function PlanoAulaCard({
  unidade,
  disciplina,
  plano,
  loading,
  onGenerate,
  onSave,
  onDelete,
}: PlanoAulaCardProps) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<LessonPlanContent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function startEdit() {
    if (plano) {
      setEditData({ ...plano.conteudo });
      setEditing(true);
    }
  }

  function saveEdit() {
    if (editData) {
      onSave(editData);
      setEditing(false);
    }
  }

  function handleDownload() {
    if (!plano?.conteudo) {
      alert("Erro: Conteúdo do plano não encontrado.");
      return;
    }

    const html = buildLessonPlanHtml({
      conteudo: plano.conteudo,
      disciplina: disciplina.nome,
      serieAno: disciplina.serieAno,
      unidadeNome: unidade.nome,
    });

    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  if (!plano) {
    return (
      <Card title="Plano de Aula" icon={<FileText className="h-6 w-6" />}>
        <EmptyState
          title="Nenhum plano de aula gerado"
          description="Gere um plano de aula completo com IA, alinhado à BNCC."
          action={
            <Button onClick={onGenerate} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
              Gerar Plano de Aula
            </Button>
          }
        />
      </Card>
    );
  }

  if (typeof plano.conteudo === "string") {
    return (
      <Card title="Plano de Aula (Versão Antiga)" icon={<AlertTriangle className="h-6 w-6 text-amber-300" />}>
        <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-50/10 p-4 text-amber-100">
          Este plano está em um formato antigo. Por favor, exclua e gere novamente.
        </div>
        <Button onClick={() => setConfirmDelete(true)} variant="danger">
          Excluir Plano Antigo
        </Button>

        <ConfirmDialog
          open={confirmDelete}
          title="Remover plano?"
          description="Isso removerá o plano atual. Deseja continuar?"
          confirmLabel="Remover"
          onConfirm={() => {
            onDelete();
            setEditing(false);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      </Card>
    );
  }

  return (
    <Card
      title="Plano de Aula"
      icon={<FileText className="h-6 w-6 text-slate-900 dark:text-white" />}
      actions={
        <LessonPlanActions
          editing={editing}
          onDownload={handleDownload}
          onStartEdit={startEdit}
          onCancelEdit={() => setEditing(false)}
          onSaveEdit={saveEdit}
          onDelete={() => setConfirmDelete(true)}
        />
      }
    >
      {editing && editData ? (
        <LessonPlanEditForm data={editData} onChange={setEditData} />
      ) : (
        <LessonPlanDisplay data={plano.conteudo as LessonPlanContent} />
      )}

      {!editing && (
        <div className="mt-4 flex items-center justify-end gap-2 text-emerald-300">
          <CheckCircle className="h-4 w-4" /> Gerado com sucesso
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Remover plano?"
        description="Isso removerá o plano atual. Deseja continuar?"
        confirmLabel="Remover"
        onConfirm={() => {
          onDelete();
          setEditing(false);
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </Card>
  );
}

export default PlanoAulaCard;
