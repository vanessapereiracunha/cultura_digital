import { useState } from "react";
import { Page } from "../../shared/components/Page";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { FormField } from "../../shared/components/FormField";
import { listarUnidadesDaDisciplina, salvarUnidade, removerUnidade, gerarSugestaoUnidades } from "./services";
import type { Unidade } from "./models";

type UnidadesPageProps = {
  disciplina: { id: string; nome: string; serieAno: string };
  onVoltar: () => void;
  onSelecionarUnidade: (unidade: Unidade) => void;
};

export default function UnidadesPage({ disciplina, onVoltar, onSelecionarUnidade }: UnidadesPageProps) {
  const [unidades, setUnidades] = useState<Unidade[]>(listarUnidadesDaDisciplina(disciplina.id));
  const [criando, setCriando] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleGerarSugestoes() {
    if (confirm("Isso usará IA para sugerir unidades com base na BNCC. Deseja continuar?")) {
      setGerando(true);
      try {
        const sugestoes = await gerarSugestaoUnidades({
          disciplina: disciplina.nome,
          serieAno: disciplina.serieAno,
        });

        for (const s of sugestoes) {
          const novaUnidade: Unidade = {
            id: crypto.randomUUID(),
            disciplinaId: disciplina.id,
            nome: s.nome,
            descricao: s.descricao,
            materiais: [],
            origem: "ia",
          };
          salvarUnidade(novaUnidade);
        }
        setUnidades(listarUnidadesDaDisciplina(disciplina.id));
      } catch (error) {
        alert("Erro ao gerar sugestões. Tente novamente.");
        console.error(error);
      } finally {
        setGerando(false);
      }
    }
  }

  function handleSalvar() {
    if (!nome.trim()) return;

    const novaUnidade: Unidade = {
      id: crypto.randomUUID(),
      disciplinaId: disciplina.id,
      nome: nome.trim(),
      descricao: descricao.trim(),
      materiais: [], // Inicialmente sem materiais
    };

    salvarUnidade(novaUnidade);
    setUnidades(listarUnidadesDaDisciplina(disciplina.id));
    setCriando(false);
    setNome("");
    setDescricao("");
  }

  function handleRemover(id: string) {
    if (confirm("Tem certeza que deseja remover esta unidade?")) {
      removerUnidade(id);
      setUnidades(listarUnidadesDaDisciplina(disciplina.id));
    }
  }

  return (
    <Page
      title={`Unidades - ${disciplina.nome}`}
      subtitle={`${disciplina.serieAno}`}
      actions={
        <Button variant="outline" onClick={onVoltar}>
          Voltar para Disciplinas
        </Button>
      }
    >
      <Card title="Unidades de Ensino">
        <div className="flex flex-col gap-4">
          {unidades.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma unidade cadastrada nesta disciplina.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {unidades.map((unidade) => (
                <div
                  key={unidade.id}
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{unidade.nome}</h4>
                      {unidade.origem === "ia" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          IA
                        </span>
                      )}
                    </div>
                    {unidade.descricao && <p className="text-sm text-gray-600">{unidade.descricao}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onSelecionarUnidade(unidade)}>
                      Materiais
                    </Button>
                    <Button variant="ghost" onClick={() => handleRemover(unidade.id)} className="text-red-600">
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!criando && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleGerarSugestoes} disabled={gerando}>
                {gerando ? "Gerando..." : "Gerar Sugestões com IA"}
              </Button>
              <Button onClick={() => setCriando(true)}>Nova Unidade</Button>
            </div>
          )}

          {criando && (
            <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-4">
              <h4 className="font-medium text-gray-900">Nova Unidade</h4>
              <FormField label="Nome da Unidade">
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Ex: Unidade 1 - Introdução"
                />
              </FormField>
              <FormField label="Descrição (opcional)">
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={2}
                />
              </FormField>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setCriando(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvar}>Salvar Unidade</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
}
