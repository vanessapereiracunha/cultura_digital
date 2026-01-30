import type { ActivityContent, ActivityQuestion } from "../../models";
import { Alert } from "../../../../shared/components/Alert";

type ActivityDisplayProps = {
  data: ActivityContent;
};

const letras = ["a", "b", "c", "d", "e"];

export function ActivityDisplay({ data }: ActivityDisplayProps) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-white/5"
      style={{ maxHeight: "520px", overflowY: "auto" }}
    >
      <h5 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{data.title || "Atividade"}</h5>

      {data.objective && (
        <>
          <h6 className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Objetivo</h6>
          <p className="text-sm text-slate-800 dark:text-slate-100">{data.objective}</p>
        </>
      )}

      {Array.isArray(data.bncc_skills) && data.bncc_skills.length > 0 && (
        <>
          <h6 className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Habilidades BNCC</h6>
          {data.bncc_skills.map((skill, index) => (
            <Alert key={index} type="info" className="mb-1">
              {skill}
            </Alert>
          ))}
        </>
      )}

      {data.content && (
        <>
          <h6 className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Texto de Apoio</h6>
          <p className="text-sm text-slate-800 dark:text-slate-100">{data.content}</p>
        </>
      )}

      {Array.isArray(data.questions) && data.questions.length > 0 && (
        <>
          <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Questões</h6>
          <div className="mt-3 space-y-6">
            {data.questions.map((q, index) => (
              <div key={index}>
                <p className="text-slate-900 dark:text-white mb-2">
                  <span className="font-bold">{index + 1}.</span> {q.enunciado}
                </p>
                {Array.isArray(q.alternativas) &&
                  q.alternativas.map((alt, altIndex) => (
                    <p key={altIndex} className="text-slate-800 dark:text-slate-100 ml-0 my-1">
                      {letras[altIndex]}) {alt.replace(/^[a-e]\)\s*/i, "")}
                    </p>
                  ))}
              </div>
            ))}
          </div>

          <h6 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Gabarito</h6>
          <div className="space-y-1 text-sm text-slate-800 dark:text-slate-100">
            {data.questions.map((q, index) => (
              <p key={index}>
                {index + 1}. {getGabaritoTexto(q)}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getGabaritoTexto(q: ActivityQuestion) {
  const letrasIdx = ["a", "b", "c", "d", "e"];
  const corretaStr = (q?.correta || "").toString().trim();
  const match = corretaStr.match(/^([a-e])\)?/i);
  const letra = match ? match[1].toLowerCase() : "";
  const idx = letrasIdx.indexOf(letra);
  const alternativa = idx >= 0 ? q?.alternativas?.[idx] : undefined;
  if (!letra) return "-";
  if (!alternativa) return letra + ")";
  const textoLimpo = alternativa.replace(/^[a-e]\)\s*/i, "");
  return letra + ") " + textoLimpo;
}
