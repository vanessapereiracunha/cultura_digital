import { Button } from "../../../../shared/components/Button";
import { Download, Edit, Trash2 } from "lucide-react";

type LessonPlanActionsProps = {
  editing: boolean;
  onDownload: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
};

export function LessonPlanActions({
  editing,
  onDownload,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: LessonPlanActionsProps) {
  if (editing) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onCancelEdit}>
          Cancelar
        </Button>
        <Button onClick={onSaveEdit}>Salvar Alterações</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onDownload} icon={<Download className="h-4 w-4" />}>
        PDF
      </Button>
      <Button variant="outline" onClick={onStartEdit} icon={<Edit className="h-4 w-4" />}>
        Editar
      </Button>
      <Button
        variant="ghost"
        className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300"
        onClick={onDelete}
        icon={<Trash2 className="h-4 w-4" />}
      />
    </div>
  );
}
