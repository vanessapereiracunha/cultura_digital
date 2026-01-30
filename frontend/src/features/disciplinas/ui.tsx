import { useState, type FormEvent } from "react";
import type { Disciplina } from "./models";
import { useDisciplinas } from "./hooks";
import { OPCOES_SERIES } from "./constants";
import { DisciplinaList } from "./components/DisciplinaList";
import { DisciplinaForm } from "./components/DisciplinaForm";
import {
  gerarAtividadeRemota,
  type ActivityResponse,
} from "../rag/services";
import { PageHeader } from "../../shared/components/PageHeader";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { Dialog } from "../../shared/components/Dialog";
import { Input, Select } from "../../shared/components/FormFields";
import { Plus, Bot, BookOpenCheck } from "lucide-react";
import { Toast } from "../../shared/components/Toast";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";

type DisciplinasPageProps = {
  onSelecionarDisciplina?: (disciplina: Disciplina) => void;
};

export function DisciplinasPage({ onSelecionarDisciplina }: DisciplinasPageProps) {
  const { disciplinas, criarDisciplina, removerDisciplina } = useDisciplinas();
  const [criando, setCriando] = useState(false);
  const [disciplinaParaExcluir, setDisciplinaParaExcluir] = useState<Disciplina | null>(null);

  return (
    <DisciplinasView
      disciplinas={disciplinas}
      criando={criando}
      disciplinaParaExcluir={disciplinaParaExcluir}
      onSelecionarDisciplina={onSelecionarDisciplina}
      onAbrirCriacao={() => setCriando(true)}
      onFecharCriacao={() => setCriando(false)}
      onCriarDisciplina={(values) => {
        criarDisciplina(values);
        setCriando(false);
      }}
      onSolicitarExclusao={(disciplina) => setDisciplinaParaExcluir(disciplina)}
      onConfirmarExclusao={() => {
        if (disciplinaParaExcluir) removerDisciplina(disciplinaParaExcluir.id);
        setDisciplinaParaExcluir(null);
      }}
      onCancelarExclusao={() => setDisciplinaParaExcluir(null)}
    />
  );
}

type DisciplinasViewProps = {
  disciplinas: Disciplina[];
  criando: boolean;
  disciplinaParaExcluir: Disciplina | null;
  onSelecionarDisciplina?: (disciplina: Disciplina) => void;
  onAbrirCriacao: () => void;
  onFecharCriacao: () => void;
  onCriarDisciplina: (values: { nome: string; serieAno: string; assunto?: string }) => void;
  onSolicitarExclusao: (disciplina: Disciplina) => void;
  onConfirmarExclusao: () => void;
  onCancelarExclusao: () => void;
};

function DisciplinasView({
  disciplinas,
  criando,
  disciplinaParaExcluir,
  onSelecionarDisciplina,
  onAbrirCriacao,
  onFecharCriacao,
  onCriarDisciplina,
  onSolicitarExclusao,
  onConfirmarExclusao,
  onCancelarExclusao,
}: DisciplinasViewProps) {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Painel do Professor" 
        subtitle="Crie aulas, provas e tarefas de Cultura Digital alinhadas à BNCC" 
      />

      <Card 
        title="Suas Disciplinas" 
        className="mb-4"
        actions={
          <Button onClick={onAbrirCriacao} icon={<Plus className="h-4 w-4" />}>
            Criar disciplina
          </Button>
        }
      >
        <p className="mb-6 text-base text-slate-600 dark:text-slate-300">Gerencie suas disciplinas, crie novas atividades, planos de aula e slides.</p>
        
        <Dialog
          open={criando}
          onClose={onFecharCriacao}
          title="Nova Disciplina"
          className="w-[520px] max-w-[92vw]"
        >
          <DisciplinaForm 
            onSubmit={onCriarDisciplina} 
            onCancel={onFecharCriacao}
          />
        </Dialog>

        <DisciplinaList
          disciplinas={disciplinas}
          onSelectDisciplina={onSelecionarDisciplina}
          onDeleteDisciplina={onSolicitarExclusao}
        />
      </Card>

      <Card title="Gerar atividade avaliativa com IA" icon={<Bot className="h-6 w-6" />}>
        <ActivityGeneratorCard />
      </Card>

      <ConfirmDialog
        open={!!disciplinaParaExcluir}
        title="Excluir disciplina?"
        description={`A disciplina "${disciplinaParaExcluir?.nome ?? ""}" e suas unidades serão removidas.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={onConfirmarExclusao}
        onCancel={onCancelarExclusao}
      />
    </div>
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
  const [showToast, setShowToast] = useState(false);

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
      setShowToast(true);
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
    <form onSubmit={handleSubmit} className="relative space-y-4">
      {showToast && (
        <Toast
          message="Atividade gerada com sucesso!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      <Input
        label="Disciplina"
        value={values.disciplina}
        onChange={(event) => handleChange("disciplina", event.target.value)}
        placeholder=" "
      />

      <Input
        label="Assunto"
        value={values.assunto}
        onChange={(event) => handleChange("assunto", event.target.value)}
        placeholder=" "
      />

      <Select
        label="Ano letivo"
        value={values.nivel}
        onChange={(event) => handleChange("nivel", event.target.value)}
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
      </Select>

      <div className="mt-4 flex items-center justify-between gap-3">
        {error ? (
          <span className="text-sm text-rose-300">{error}</span>
        ) : resultado ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <BookOpenCheck className="h-4 w-4" /> Atividade gerada com sucesso!
          </span>
        ) : (
          <span />
        )}
        <Button type="submit" loading={loading} disabled={loading}>
          Gerar atividade
        </Button>
      </div>
    </form>
  );
}

export default DisciplinasPage;
