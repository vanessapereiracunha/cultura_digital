import { useState } from "react";
import type { AtividadeAvaliativa, ActivityContent } from "../../models";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";
import { EmptyState } from "../../../../shared/components/EmptyState";
import { ConfirmDialog } from "../../../../shared/components/ConfirmDialog";
import { ClipboardList, Sparkles, CheckCircle2 } from "lucide-react";
import { buildActivityHtml } from "../../../../shared/utils/materialExport";
import { ActivityDisplay } from "./Display";
import { ActivityEditForm } from "./EditForm";
import { ActivityActions } from "./Actions";

type AtividadeCardProps = {
  disciplina: { nome: string; serieAno: string };
  atividade: AtividadeAvaliativa | null;
  loading: boolean;
  onGenerate: () => void;
  onSave: (conteudo: ActivityContent) => void;
  onDelete: () => void;
};

export function AtividadeCard({
  disciplina,
  atividade,
  loading,
  onGenerate,
  onSave,
  onDelete,
}: AtividadeCardProps) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<ActivityContent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function startEdit() {
    if (atividade) {
      const base = atividade.conteudo ?? {};
      setEditData(
        JSON.parse(
          JSON.stringify({
            title: base.title ?? "",
            objective: base.objective ?? "",
            content: base.content ?? "",
            bncc_skills: base.bncc_skills ?? [],
            questions: base.questions ?? [],
          }),
        ),
      );
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
    if (!atividade) return;
    const html = buildActivityHtml({
      conteudo: atividade.conteudo || {},
      disciplina: disciplina.nome,
      serieAno: disciplina.serieAno,
    });

    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  function handleDelete() {
    setConfirmDelete(true);
  }

  if (!atividade) {
    return (
      <Card title="Atividade Avaliativa" icon={<ClipboardList className="h-6 w-6" />}>
        <EmptyState
          title="Nenhuma atividade gerada"
          description="Gere uma atividade avaliativa baseada na unidade."
          action={
            <Button onClick={onGenerate} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
              Gerar Atividade
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title="Atividade Avaliativa"
      icon={<ClipboardList className="h-6 w-6 text-slate-900 dark:text-white" />}
      actions={
        <ActivityActions
          editing={editing}
          onDownload={handleDownload}
          onStartEdit={startEdit}
          onCancelEdit={() => setEditing(false)}
          onSaveEdit={saveEdit}
          onDelete={handleDelete}
        />
      }
    >
      {editing && editData ? (
        <ActivityEditForm data={editData} onChange={setEditData} />
      ) : (
        <ActivityDisplay data={atividade.conteudo || { title: "" }} />
      )}

      {!editing && (
        <div className="mt-4 flex items-center justify-end gap-2 text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Gerado com sucesso
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Remover atividade?"
        description="Isso removerá a atividade atual."
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

export default AtividadeCard;
