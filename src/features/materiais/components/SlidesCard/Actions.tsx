import { Button } from "../../../../shared/components/Button";
import { Monitor, Download, Trash2 } from "lucide-react";
import type { Slide } from "../../models";

type SlidesActionsProps = {
  slides: Slide;
  onDelete: () => void;
};

export function SlidesActions({ slides, onDelete }: SlidesActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {slides.edit_url && (
        <Button variant="outline" icon={<Monitor className="h-4 w-4" />} onClick={() => window.open(slides.edit_url, "_blank")}>
          Visualizar
        </Button>
      )}
      {slides.pdf_url && (
        <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={() => window.open(slides.pdf_url, "_blank")}>
          PDF
        </Button>
      )}
      <Button
        variant="ghost"
        className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300"
        onClick={onDelete}
        icon={<Trash2 className="h-4 w-4" />}
      />
    </div>
  );
}
