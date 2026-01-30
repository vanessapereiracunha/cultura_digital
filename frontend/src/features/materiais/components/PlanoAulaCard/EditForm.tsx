import type { LessonPlanContent } from "../../models";
import { ReactNode } from "react";
import { Button } from "../../../../shared/components/Button";
import { Input, Textarea } from "../../../../shared/components/FormFields";
import { Plus, Trash2 } from "lucide-react";

type LessonPlanEditFormProps = {
  data: LessonPlanContent;
  onChange: (data: LessonPlanContent) => void;
};

type ArrayField = "objetivos" | "conteudoProgramatico" | "estrategiasEnsino" | "bncc" | "recursos" | "referencias";

export function LessonPlanEditForm({ data, onChange }: LessonPlanEditFormProps) {
  const handleChange = <K extends keyof LessonPlanContent>(field: K, value: LessonPlanContent[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleArrayChange = (field: ArrayField, index: number, value: string) => {
    const arr = [...(data[field] || [])];
    arr[index] = value;
    handleChange(field, arr as LessonPlanContent[ArrayField]);
  };

  const addItem = (field: ArrayField) => {
    const arr = [...(data[field] || []), ""];
    handleChange(field, arr as LessonPlanContent[ArrayField]);
  };

  const removeItem = (field: ArrayField, index: number) => {
    const arr = [...(data[field] || [])];
    arr.splice(index, 1);
    handleChange(field, arr as LessonPlanContent[ArrayField]);
  };

  return (
    <div
      className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10"
      style={{ maxHeight: "600px", overflowY: "auto" }}
    >
      <Input label="Título" value={data.titulo} onChange={(e) => handleChange("titulo", e.target.value)} className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Input label="Duração" value={data.duracao} onChange={(e) => handleChange("duracao", e.target.value)} />
        </div>
        <div>
          <Input label="Série/Ano" value={data.serieAno} onChange={(e) => handleChange("serieAno", e.target.value)} />
        </div>
      </div>

      <Section
        title="Objetivos"
        items={data.objetivos}
        onAdd={() => addItem("objetivos")}
        renderItem={(obj, i) => (
          <Row key={i}>
            <Input label={`Objetivo ${i + 1}`} value={obj} onChange={(e) => handleArrayChange("objetivos", i, e.target.value)} className="flex-1" />
            <RemoveButton onClick={() => removeItem("objetivos", i)} />
          </Row>
        )}
      />

      <Section
        title="Conteúdo Programático"
        items={data.conteudoProgramatico || []}
        onAdd={() => addItem("conteudoProgramatico")}
        renderItem={(cont, i) => (
          <Row key={i}>
            <Input label={`Tópico ${i + 1}`} value={cont} onChange={(e) => handleArrayChange("conteudoProgramatico", i, e.target.value)} className="flex-1" />
            <RemoveButton onClick={() => removeItem("conteudoProgramatico", i)} />
          </Row>
        )}
      />

      <Section
        title="Habilidades BNCC / CIEB"
        items={data.bncc || []}
        onAdd={() => addItem("bncc")}
        renderItem={(skill, i) => (
          <Row key={i}>
            <Input label={`Habilidade ${i + 1}`} value={skill} onChange={(e) => handleArrayChange("bncc", i, e.target.value)} className="flex-1" />
            <RemoveButton onClick={() => removeItem("bncc", i)} />
          </Row>
        )}
      />

      <Section
        title="Estratégias de Ensino"
        items={data.estrategiasEnsino || []}
        onAdd={() => addItem("estrategiasEnsino")}
        renderItem={(step, i) => (
          <Row key={i}>
            <Textarea label={`Passo ${i + 1}`} value={step} onChange={(e) => handleArrayChange("estrategiasEnsino", i, e.target.value)} className="flex-1" />
            <RemoveButton onClick={() => removeItem("estrategiasEnsino", i)} />
          </Row>
        )}
      />

      <Textarea
        label="Avaliação"
        value={typeof data.avaliacao === "string" ? data.avaliacao : JSON.stringify(data.avaliacao)}
        onChange={(e) => handleChange("avaliacao", e.target.value)}
        className="mt-2"
      />

      <Section
        title="Recursos Necessários"
        items={data.recursos || []}
        onAdd={() => addItem("recursos")}
        renderItem={(rec, i) => (
          <Row key={i}>
            <Input label={`Recurso ${i + 1}`} value={rec} onChange={(e) => handleArrayChange("recursos", i, e.target.value)} className="flex-1" />
            <RemoveButton onClick={() => removeItem("recursos", i)} />
          </Row>
        )}
      />

      <Section
        title="Referências"
        items={data.referencias || []}
        onAdd={() => addItem("referencias")}
        renderItem={(ref, i) => (
          <Row key={i}>
            <Input label={`Referência ${i + 1}`} value={ref} onChange={(e) => handleArrayChange("referencias", i, e.target.value)} className="flex-1" />
            <RemoveButton onClick={() => removeItem("referencias", i)} />
          </Row>
        )}
      />
    </div>
  );
}

function Section({
  title,
  items,
  onAdd,
  renderItem,
}: {
  title: string;
  items: string[];
  onAdd: () => void;
  renderItem: (item: string, index: number) => ReactNode;
}) {
  return (
    <>
      <h6 className="font-bold text-slate-900 dark:text-white mt-4 mb-2">{title}</h6>
      {items.map((item, i) => renderItem(item, i))}
      <Button variant="outline" size="sm" onClick={onAdd} icon={<Plus className="h-4 w-4" />}>
        Adicionar
      </Button>
    </>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 mb-2">{children}</div>;
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300"
      icon={<Trash2 className="h-4 w-4" />}
      onClick={onClick}
    />
  );
}
