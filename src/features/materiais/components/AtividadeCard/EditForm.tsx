import type { ActivityContent } from "../../models";
import { Button } from "../../../../shared/components/Button";
import { Input, Textarea } from "../../../../shared/components/FormFields";
import { Plus, Trash2 } from "lucide-react";

type ActivityEditFormProps = {
  data: ActivityContent;
  onChange: (data: ActivityContent) => void;
};

const letras = ["a", "b", "c", "d", "e"];

export function ActivityEditForm({ data, onChange }: ActivityEditFormProps) {
  const updateField = <K extends keyof ActivityContent>(field: K, value: ActivityContent[K]) => {
    onChange({ ...data, [field]: value });
  };

  const updateSkill = (index: number, value: string) => {
    const skills = [...(data.bncc_skills || [])];
    skills[index] = value;
    updateField("bncc_skills", skills);
  };

  const addSkill = () => {
    updateField("bncc_skills", [...(data.bncc_skills || []), ""]);
  };

  const removeSkill = (index: number) => {
    const skills = [...(data.bncc_skills || [])];
    skills.splice(index, 1);
    updateField("bncc_skills", skills);
  };

  const ensureQuestions = () => [...(data.questions || [])];

  const addQuestion = () => {
    updateField("questions", [
      ...ensureQuestions(),
      { enunciado: "", alternativas: ["", "", "", ""], correta: "a)" },
    ]);
  };

  const removeQuestion = (index: number) => {
    const questions = ensureQuestions();
    questions.splice(index, 1);
    updateField("questions", questions);
  };

  const updateQuestionField = (index: number, field: "enunciado" | "correta", value: string) => {
    const questions = ensureQuestions();
    questions[index] = { ...(questions[index] || {}), [field]: value };
    updateField("questions", questions);
  };

  const updateAlternative = (qIndex: number, altIndex: number, value: string) => {
    const questions = ensureQuestions();
    const question = { ...(questions[qIndex] || {}) };
    const alternativas = [...(question.alternativas || [])];
    alternativas[altIndex] = value;
    question.alternativas = alternativas;
    questions[qIndex] = question as any;
    updateField("questions", questions);
  };

  return (
    <div className="space-y-4">
      <Input label="Título" value={data.title ?? ""} onChange={(e) => updateField("title", e.target.value)} />
      <Textarea label="Objetivo" value={data.objective ?? ""} onChange={(e) => updateField("objective", e.target.value)} rows={2} />
      <Textarea label="Texto de Apoio" value={data.content ?? ""} onChange={(e) => updateField("content", e.target.value)} rows={3} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h6 className="text-sm font-semibold text-slate-700 dark:text-slate-200 m-0">Habilidades BNCC</h6>
          <Button variant="outline" size="sm" type="button" icon={<Plus className="h-4 w-4" />} onClick={addSkill}>
            Adicionar
          </Button>
        </div>
        {(data.bncc_skills || []).map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input label={`Habilidade ${index + 1}`} value={skill} onChange={(e) => updateSkill(index, e.target.value)} className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => removeSkill(index)}
              title="Remover habilidade"
              type="button"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h6 className="text-sm font-semibold text-slate-700 dark:text-slate-200 m-0">Questões</h6>
          <Button variant="outline" size="sm" type="button" icon={<Plus className="h-4 w-4" />} onClick={addQuestion}>
            Nova questão
          </Button>
        </div>
        {(data.questions || []).map((q, qIndex) => (
          <div key={qIndex} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900/60 space-y-2">
            <div className="flex items-start gap-2">
              <Input
                label={`Pergunta ${qIndex + 1}`}
                value={q?.enunciado ?? ""}
                onChange={(e) => updateQuestionField(qIndex, "enunciado", e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:text-white dark:hover:bg-rose-50/10 dark:hover:text-rose-300"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => removeQuestion(qIndex)}
                title="Remover questão"
                type="button"
              />
            </div>

            {(q?.alternativas || []).map((alt, altIndex) => {
              const letra = letras[altIndex] ?? "";
              const isCorrect = (q?.correta ?? "").toLowerCase().startsWith(letra);
              return (
                <div key={altIndex} className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant={isCorrect ? "primary" : "outline"}
                    size="sm"
                    onClick={() => updateQuestionField(qIndex, "correta", `${letra})`)}
                    className="min-w-[44px]"
                  >
                    {letra.toUpperCase()}
                  </Button>
                  <Input
                    label={`Alternativa ${letra})`}
                    value={(alt ?? "").replace(/^[a-e]\)\s*/i, "")}
                    onChange={(e) => updateAlternative(qIndex, altIndex, `${letra}) ${e.target.value}`)}
                    className="flex-1"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
