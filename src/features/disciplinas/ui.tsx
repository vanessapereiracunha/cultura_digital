import { useState, type FormEvent } from "react";
import { Page } from "../../shared/components/Page";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { FormField } from "../../shared/components/FormField";
import { RAG_BASE_URL } from "../../core/config/api";
import type { Disciplina } from "./models";
import { listarDisciplinas, salvarDisciplina, removerDisciplina } from "./services";
import { OPCOES_SERIES } from "./constants";
import { DisciplinaList } from "./components/DisciplinaList";
import { DisciplinaForm } from "./components/DisciplinaForm";
import {
  gerarAtividadeRemota,
  type ActivityResponse,
} from "../rag/services";

type DisciplinasPageProps = {
  onSelecionarDisciplina?: (disciplina: Disciplina) => void;
};

export function DisciplinasPage({ onSelecionarDisciplina }: DisciplinasPageProps) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(listarDisciplinas());
  const [criando, setCriando] = useState(false);

  function handleCriarDisciplina(values: { nome: string; serieAno: string; assunto?: string }) {
    const novaDisciplina: Disciplina = {
      id: crypto.randomUUID(),
      nome: values.nome,
      serieAno: values.serieAno,
      assunto: values.assunto,
    };
    salvarDisciplina(novaDisciplina);
    setDisciplinas(listarDisciplinas());
    setCriando(false);
  }

  function handleRemoverDisciplina(disciplina: Disciplina) {
    if (confirm(`Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?`)) {
      removerDisciplina(disciplina.id);
      setDisciplinas(listarDisciplinas());
    }
  }

  return (
    <Page title="Cultura Digital" subtitle="Suas disciplinas">
      <Card title="Suas Disciplinas">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Gerencie suas turmas e conteúdos.</p>
            <Button type="button" onClick={() => setCriando(true)}>
              Criar disciplina
            </Button>
          </div>
          
          {criando ? (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-4">Nova Disciplina</h4>
              <DisciplinaForm onSubmit={handleCriarDisciplina} />
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" onClick={() => setCriando(false)} className="text-sm">Cancelar</Button>
              </div>
            </div>
          ) : null}

          <DisciplinaList
            disciplinas={disciplinas}
            onSelectDisciplina={onSelecionarDisciplina}
            onDeleteDisciplina={handleRemoverDisciplina}
          />
        </div>
      </Card>
      <Card title="Gerar atividade avaliativa com IA">
        <ActivityGeneratorCard />
      </Card>
    </Page>
  );
}

type ActivityGeneratorState = {
  disciplina: string;
  assunto: string;
  nivel: string;
};

function ActivityGeneratorCard() {
  const [values, setValues] = useState<ActivityGeneratorState>({
    disciplina: "",
    assunto: "",
    nivel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ActivityResponse | null>(null);

  function handleChange(field: keyof ActivityGeneratorState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.disciplina.trim() || !values.assunto.trim() || !values.nivel.trim()) {
      setError("Preencha todos os campos antes de gerar a atividade.");
      return;
    }

    setError(null);
    setLoading(true);
    setResultado(null);

    try {
      const response = await gerarAtividadeRemota({
        disciplina: values.disciplina.trim(),
        assunto: values.assunto.trim(),
        nivel: values.nivel.trim(),
      });
      setResultado(response);
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Não foi possível gerar a atividade agora. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <FormField label="Disciplina">
        <input
          value={values.disciplina}
          onChange={(event) => handleChange("disciplina", event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </FormField>
      <FormField label="Tema / Assunto da aula">
        <input
          value={values.assunto}
          onChange={(event) => handleChange("assunto", event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </FormField>
      <FormField label="Nível / Série">
        <select
          value={values.nivel}
          onChange={(event) => handleChange("nivel", event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">Selecione uma série</option>
          {OPCOES_SERIES.map((grupo) => (
            <optgroup key={grupo.label} label={grupo.label}>
              {grupo.options.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </FormField>
      <div className="flex items-center gap-3 justify-end">
        {error ? <span className="text-sm text-red-600">{error}</span> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Gerando atividade..." : "Gerar atividade"}
        </Button>
      </div>
      {resultado ? (
        <div className="mt-2 text-sm text-gray-800">
          <span className="block mb-1">Atividade gerada com sucesso.</span>
          <a
            href={`${RAG_BASE_URL}${resultado.download_url}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Baixar atividade ({resultado.filename})
          </a>
        </div>
      ) : null}
    </form>
  );
}

export default DisciplinasPage;
