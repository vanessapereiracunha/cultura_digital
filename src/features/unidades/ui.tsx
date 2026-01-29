import { useState, type ReactNode } from "react";
import { useUnidades } from "./hooks";
import type { Unidade } from "./models";
import { PageHeader } from "../../shared/components/PageHeader";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { Dialog } from "../../shared/components/Dialog";
import { Input } from "../../shared/components/FormFields";
import { EmptyState } from "../../shared/components/EmptyState";
import { UnidadeCard } from "./components/UnidadeCard";
import { Sparkles, Plus } from "lucide-react";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";

type UnidadesPageProps = {
  disciplina: { id: string; nome: string; serieAno: string };
  onVoltar: () => void;
  onSelecionarUnidade: (unidade: Unidade) => void;
};

export default function UnidadesPage({ disciplina, onVoltar, onSelecionarUnidade }: UnidadesPageProps) {
  const {
    unidades,
    loadingSugestoes,
    criarUnidade,
    removerUnidade,
    sugerirUnidades,
  } = useUnidades(disciplina);

  const [criando, setCriando] = useState(false);
  const [confirmarIA, setConfirmarIA] = useState(false);
  const [unidadeParaExcluir, setUnidadeParaExcluir] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  return (
    <UnidadesView
      disciplina={disciplina}
      onVoltar={onVoltar}
      backLabel={
        <>
          <span className="sm:hidden">Voltar</span>
          <span className="hidden sm:inline">Voltar para Disciplinas</span>
        </>
      }
      unidades={unidades}
      criando={criando}
      nome={nome}
      descricao={descricao}
      confirmandoIA={confirmarIA}
      unidadeParaExcluir={unidadeParaExcluir}
      loadingSugestoes={loadingSugestoes}
      onSelecionarUnidade={onSelecionarUnidade}
      onAbrirCriacao={() => setCriando(true)}
      onFecharCriacao={() => {
        setCriando(false);
        setNome("");
        setDescricao("");
      }}
      onChangeNome={setNome}
      onChangeDescricao={setDescricao}
      onSalvarNovaUnidade={() => {
        if (!nome.trim()) return;
        criarUnidade({ nome, descricao });
        setCriando(false);
        setNome("");
        setDescricao("");
      }}
      onSolicitarExclusao={(id) => setUnidadeParaExcluir(id)}
      onConfirmarExclusao={() => {
        if (unidadeParaExcluir) removerUnidade(unidadeParaExcluir);
        setUnidadeParaExcluir(null);
      }}
      onCancelarExclusao={() => setUnidadeParaExcluir(null)}
      onSolicitarSugestoes={() => setConfirmarIA(true)}
      onConfirmarSugestoes={async () => {
        setConfirmarIA(false);
        await sugerirUnidades();
      }}
      onCancelarSugestoes={() => setConfirmarIA(false)}
    />
  );
}

type UnidadesViewProps = {
  disciplina: { id: string; nome: string; serieAno: string };
  onVoltar: () => void;
  backLabel?: ReactNode;
  unidades: Unidade[];
  criando: boolean;
  nome: string;
  descricao: string;
  confirmandoIA: boolean;
  unidadeParaExcluir: string | null;
  loadingSugestoes: boolean;
  onSelecionarUnidade: (unidade: Unidade) => void;
  onAbrirCriacao: () => void;
  onFecharCriacao: () => void;
  onChangeNome: (value: string) => void;
  onChangeDescricao: (value: string) => void;
  onSalvarNovaUnidade: () => void;
  onSolicitarExclusao: (id: string) => void;
  onConfirmarExclusao: () => void;
  onCancelarExclusao: () => void;
  onSolicitarSugestoes: () => void;
  onConfirmarSugestoes: () => void;
  onCancelarSugestoes: () => void;
};

function UnidadesView({
  disciplina,
  onVoltar,
  backLabel,
  unidades,
  criando,
  nome,
  descricao,
  confirmandoIA,
  unidadeParaExcluir,
  loadingSugestoes,
  onSelecionarUnidade,
  onAbrirCriacao,
  onFecharCriacao,
  onChangeNome,
  onChangeDescricao,
  onSalvarNovaUnidade,
  onSolicitarExclusao,
  onConfirmarExclusao,
  onCancelarExclusao,
  onSolicitarSugestoes,
  onConfirmarSugestoes,
  onCancelarSugestoes,
}: UnidadesViewProps) {
  return (
    <main className="space-y-8">
      <PageHeader
        title={`Unidade - ${disciplina.nome}`}
        subtitle={disciplina.serieAno}
        onBack={onVoltar}
        backLabel={backLabel ?? (
          <>
            <span className="sm:hidden">Voltar</span>
            <span className="hidden sm:inline">Voltar para Disciplinas</span>
          </>
        )}
      />

      <Card
        title="Unidades de Ensino"
        actions={
          !criando && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
              <Button 
                variant="outline" 
                onClick={onSolicitarSugestoes} 
                disabled={loadingSugestoes} 
                loading={loadingSugestoes}
                icon={<Sparkles className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                {loadingSugestoes ? "Gerando..." : "Gerar com IA"}
              </Button>
              <Button onClick={onAbrirCriacao} icon={<Plus className="h-5 w-5 " />} className="w-full sm:w-auto">
                Nova Unidade
              </Button>
            </div>
          )
        }
      >
        {unidades.length === 0 ? (
          <EmptyState
            title="Nenhuma unidade cadastrada"
            description="Cadastre uma unidade manualmente ou gere com IA."
          />
        ) : (
          <div className="space-y-3">
            {unidades.map((unidade) => (
              <UnidadeCard 
                key={unidade.id}
                unidade={unidade}
                actions={{
                  onSelect: () => onSelecionarUnidade(unidade),
                  onDelete: () => onSolicitarExclusao(unidade.id),
                }}
              />
            ))}
          </div>
        )}

        <Dialog
          open={criando}
          onClose={onFecharCriacao}
          title="Nova Unidade"
          actions={
            <div className="flex w-full items-center justify-between">
              <Button variant="ghost" onClick={onFecharCriacao}>
                Cancelar
              </Button>
              <Button onClick={onSalvarNovaUnidade}>
                Confirmar
              </Button>
            </div>
          }
        >
          <Input
            label="Nome da Unidade"
            value={nome}
            onChange={(e) => onChangeNome(e.target.value)}
          />
          <Input
            label="Descrição (Opcional)"
            value={descricao}
            onChange={(e) => onChangeDescricao(e.target.value)}
          />
        </Dialog>
      </Card>

      <ConfirmDialog
        open={confirmandoIA}
        title="Você deseja gerar as unidades desta disciplina com IA?"
        description="Vamos usar IA para sugerir unidades com base na BNCC. Deseja continuar?"
        confirmLabel="Confirmar"
        onConfirm={onConfirmarSugestoes}
        onCancel={onCancelarSugestoes}
      />

      <ConfirmDialog
        open={!!unidadeParaExcluir}
        title="Remover unidade?"
        description="Esta unidade e seus materiais serão removidos."
        confirmLabel="Remover"
        onConfirm={onConfirmarExclusao}
        onCancel={onCancelarExclusao}
      />
    </main>
  );
}
