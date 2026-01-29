import type { LessonPlanContent } from "../../models";
import { Clock3, GraduationCap } from "lucide-react";

type LessonPlanDisplayProps = {
  data: LessonPlanContent;
};

export function LessonPlanDisplay({ data }: LessonPlanDisplayProps) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-white/5"
      style={{ maxHeight: "520px", overflowY: "auto" }}
    >
      <h5 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{data.titulo}</h5>

      <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
        <span className="flex items-center gap-1.5">
          <Clock3 className="h-4 w-4" /> {data.duracao}
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4" /> {data.serieAno}
        </span>
      </div>

      <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Objetivos de Aprendizagem</h6>
      <ul className="mt-2 space-y-1">
        {Array.isArray(data.objetivos) &&
          data.objetivos.map((obj, i) => (
            <li key={i} className="text-sm text-slate-800 dark:text-slate-100">
              • {obj}
            </li>
          ))}
      </ul>

      {Array.isArray(data.conteudoProgramatico) && data.conteudoProgramatico.length > 0 && (
        <>
          <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Conteúdo Programático</h6>
          <ul className="mt-2 space-y-1">
            {data.conteudoProgramatico.map((cont, i) => (
              <li key={i} className="text-sm text-slate-800 dark:text-slate-100">
                • {cont}
              </li>
            ))}
          </ul>
        </>
      )}

      {Array.isArray(data.bncc) && data.bncc.length > 0 && (
        <>
          <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Habilidades BNCC / CIEB</h6>
          <div className="mt-2 space-y-1">
            {data.bncc.map((skill, i) => (
              <p
                key={i}
                className="text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border-l-2 border-slate-400"
              >
                {skill}
              </p>
            ))}
          </div>
        </>
      )}

      <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Estratégias de Ensino</h6>
      <div className="mt-2 space-y-2">
        {Array.isArray(data.estrategiasEnsino) &&
          data.estrategiasEnsino.map((step, i) => (
            <p key={i} className="text-sm text-slate-800 dark:text-slate-100">
              <span className="font-bold">{i + 1}.</span> {step}
            </p>
          ))}
      </div>

      <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Avaliação</h6>
      <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">
        {typeof data.avaliacao === "string" ? data.avaliacao : JSON.stringify(data.avaliacao)}
      </p>

      {Array.isArray(data.recursos) && data.recursos.length > 0 && (
        <>
          <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Recursos Necessários</h6>
          <ul className="mt-2 space-y-1">
            {data.recursos.map((rec, i) => (
              <li key={i} className="text-sm text-slate-800 dark:text-slate-100">
                • {rec}
              </li>
            ))}
          </ul>
        </>
      )}

      {Array.isArray(data.referencias) && data.referencias.length > 0 && (
        <>
          <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Referências</h6>
          <ul className="mt-2 space-y-1">
            {data.referencias.map((ref, i) => (
              <li key={i} className="text-sm text-slate-800 dark:text-slate-100 italic">
                • {ref}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
