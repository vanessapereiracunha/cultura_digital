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
  onStatusChange: (status: "andamento" | "concluida") => void;
};

export function AtividadeCard({
  disciplina,
  atividade,
  loading,
  onGenerate,
  onSave,
  onDelete,
  onStatusChange,
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
                atividade.status === "concluida"
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
                atividade.status === "andamento" || !atividade.status
                  ? "border-transparent bg-orange-500 text-white shadow-sm hover:bg-orange-400 dark:bg-orange-400 dark:hover:bg-orange-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              }
            >
              Em andamento
            </Button>
          </div>
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
