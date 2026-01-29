import type { Unidade } from "../unidades/models";
import type { Disciplina } from "../disciplinas/models";
import { PageHeader } from "../../shared/components/PageHeader";
import { PlanoAulaCard } from "./components/PlanoAulaCard";
import { AtividadeCard } from "./components/AtividadeCard";
import { SlidesCard } from "./components/SlidesCard";
import { useMateriais } from "./hooks";

type MateriaisPageProps = {
  disciplina: Disciplina;
  unidade: Unidade;
  onVoltar: () => void;
};

export default function MateriaisPage({ disciplina, unidade, onVoltar }: MateriaisPageProps) {
  const {
    plano,
    atividade,
    slides,
    loadingPlano,
    loadingAtividade,
    loadingSlides,
    gerarPlano,
    salvarPlanoEditado,
    removerPlano,
    gerarAtividade,
    salvarAtividadeEditada,
    removerAtividade,
    gerarSlides,
    removerSlides,
  } = useMateriais({ unidade, disciplina });

  return (
    <MateriaisView
      disciplina={disciplina}
      unidade={unidade}
      onVoltar={onVoltar}
      planoState={{ plano, loadingPlano, gerarPlano, salvarPlanoEditado, removerPlano }}
      atividadeState={{ atividade, loadingAtividade, gerarAtividade, salvarAtividadeEditada, removerAtividade }}
      slidesState={{ slides, loadingSlides, gerarSlides, removerSlides }}
    />
  );
}

type MateriaisViewProps = {
  disciplina: Disciplina;
  unidade: Unidade;
  onVoltar: () => void;
  planoState: {
    plano: ReturnType<typeof useMateriais>["plano"];
    loadingPlano: boolean;
    gerarPlano: () => void;
    salvarPlanoEditado: (c: any) => void;
    removerPlano: () => void;
  };
  atividadeState: {
    atividade: ReturnType<typeof useMateriais>["atividade"];
    loadingAtividade: boolean;
    gerarAtividade: () => void;
    salvarAtividadeEditada: (c: any) => void;
    removerAtividade: () => void;
  };
  slidesState: {
    slides: ReturnType<typeof useMateriais>["slides"];
    loadingSlides: boolean;
    gerarSlides: () => void;
    removerSlides: () => void;
  };
};

function MateriaisView({
  disciplina,
  unidade,
  onVoltar,
  planoState,
  atividadeState,
  slidesState,
}: MateriaisViewProps) {
  return (
    <main className="space-y-8">
      <PageHeader
        title={`${unidade.nome}`}
        subtitle={`${disciplina.nome} - ${disciplina.serieAno}`}
        onBack={onVoltar}
        backLabel="Voltar para Unidades"
      />

      <div className="grid">
        <div className="s12 mb-4">
          <PlanoAulaCard
            unidade={unidade}
            disciplina={disciplina}
            plano={planoState.plano}
            loading={planoState.loadingPlano}
            onGenerate={planoState.gerarPlano}
            onSave={planoState.salvarPlanoEditado}
            onDelete={planoState.removerPlano}
          />
        </div>

        <div className="s12 mb-4">
          <AtividadeCard
            disciplina={disciplina}
            atividade={atividadeState.atividade}
            loading={atividadeState.loadingAtividade}
            onGenerate={atividadeState.gerarAtividade}
            onSave={atividadeState.salvarAtividadeEditada}
            onDelete={atividadeState.removerAtividade}
          />
        </div>

        <div className="s12 mb-4">
          <SlidesCard
            unidade={unidade}
            slides={slidesState.slides}
            loading={slidesState.loadingSlides}
            onGenerate={slidesState.gerarSlides}
            onDelete={slidesState.removerSlides}
          />
        </div>
      </div>
    </main>
  );
}
