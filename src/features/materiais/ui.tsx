import { useState, useEffect } from "react";
import { Page } from "../../shared/components/Page";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { 
  gerarPlanoDeAula, buscarPlanoDaUnidade, salvarPlano, removerPlano,
  gerarAtividade, buscarAtividadeDaUnidade, salvarAtividade, removerAtividade,
  gerarSlides, buscarSlidesDaUnidade, salvarSlides, removerSlides
} from "./services";
import type { PlanoDeAula, AtividadeAvaliativa, Slide } from "./models";
import type { Unidade } from "../unidades/models";
import type { Disciplina } from "../disciplinas/models";

type MateriaisPageProps = {
  disciplina: Disciplina;
  unidade: Unidade;
  onVoltar: () => void;
};

export default function MateriaisPage({ disciplina, unidade, onVoltar }: MateriaisPageProps) {
  // Estado Plano
  const [plano, setPlano] = useState<PlanoDeAula | null>(null);
  const [gerandoPlano, setGerandoPlano] = useState(false);
  const [editandoPlano, setEditandoPlano] = useState(false);
  const [conteudoEditado, setConteudoEditado] = useState("");

  // Estado Atividade
  const [atividade, setAtividade] = useState<AtividadeAvaliativa | null>(null);
  const [gerandoAtividade, setGerandoAtividade] = useState(false);
  const [editandoAtividade, setEditandoAtividade] = useState(false);
  const [conteudoAtividadeEditado, setConteudoAtividadeEditado] = useState("");

  // Estado Slides
  const [gerandoSlides, setGerandoSlides] = useState(false);
  const [slideResult, setSlideResult] = useState<Slide | null>(null);

  useEffect(() => {
    // Carregar Plano
    const planoSalvo = buscarPlanoDaUnidade(unidade.id);
    setPlano(planoSalvo || null);

    // Carregar Atividade
    const atividadeSalva = buscarAtividadeDaUnidade(unidade.id);
    setAtividade(atividadeSalva || null);

    // Carregar Slides
    const slideSalvo = buscarSlidesDaUnidade(unidade.id);
    setSlideResult(slideSalvo || null);
  }, [unidade.id]);

  // --- Handlers Plano ---

  async function handleGerarPlano() {
    setGerandoPlano(true);
    try {
      const novoPlano = await gerarPlanoDeAula({
        disciplina: disciplina.nome,
        serieAno: disciplina.serieAno,
        unidade: unidade.nome,
        descricao: unidade.descricao ?? "",
      }, unidade.id);
      
      salvarPlano(novoPlano);
      setPlano(novoPlano);
    } catch (error) {
      alert("Erro ao gerar plano de aula.");
      console.error(error);
    } finally {
      setGerandoPlano(false);
    }
  }

  function handleIniciarEdicao() {
    if (plano) {
      setConteudoEditado(plano.conteudo);
      setEditandoPlano(true);
    }
  }

  function handleSalvarEdicao() {
    if (plano) {
      const planoAtualizado = { ...plano, conteudo: conteudoEditado };
      salvarPlano(planoAtualizado);
      setPlano(planoAtualizado);
      setEditandoPlano(false);
    }
  }

  function handleCancelarEdicao() {
    setEditandoPlano(false);
    setConteudoEditado("");
  }

  function handleDescartarPlano() {
    if (confirm("Tem certeza? Isso removerá o plano atual.")) {
      if (plano?.id) removerPlano(plano.id);
      setPlano(null);
    }
  }

  function handleBaixarPlano() {
    if (!plano) return;
    const blob = new Blob([plano.conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Plano_Aula_${disciplina.nome}_${unidade.nome}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Handlers Atividade ---

  async function handleGerarAtividade() {
    setGerandoAtividade(true);
    try {
      const novaAtividade = await gerarAtividade({
        disciplina: disciplina.nome,
        assunto: unidade.nome,
        nivel: disciplina.serieAno,
      }, unidade.id);
      
      salvarAtividade(novaAtividade);
      setAtividade(novaAtividade);
    } catch (error) {
      alert("Erro ao gerar atividade.");
      console.error(error);
    } finally {
      setGerandoAtividade(false);
    }
  }

  function handleDescartarAtividade() {
    if (confirm("Tem certeza? Isso removerá a atividade atual.")) {
      if (atividade?.id) removerAtividade(atividade.id);
      setAtividade(null);
    }
  }

  function handleIniciarEdicaoAtividade() {
    if (atividade && atividade.conteudo) {
      setConteudoAtividadeEditado(JSON.stringify(atividade.conteudo, null, 2));
      setEditandoAtividade(true);
    }
  }

  function handleSalvarEdicaoAtividade() {
    if (atividade) {
      try {
        const conteudoObjeto = JSON.parse(conteudoAtividadeEditado);
        const atividadeAtualizada = { ...atividade, conteudo: conteudoObjeto };
        salvarAtividade(atividadeAtualizada);
        setAtividade(atividadeAtualizada);
        setEditandoAtividade(false);
      } catch (e) {
        alert("Erro ao salvar: O formato do texto é inválido (JSON inválido). Verifique a sintaxe.");
      }
    }
  }

  function handleCancelarEdicaoAtividade() {
    setEditandoAtividade(false);
    setConteudoAtividadeEditado("");
  }

  // --- Handlers Slides ---

  async function handleGerarSlides() {
    setGerandoSlides(true);
    try {
      const novoSlide = await gerarSlides({
        topic: unidade.nome,
        slides_count: 5
      }, unidade.id);
      
      salvarSlides(novoSlide);
      setSlideResult(novoSlide);
    } catch (error) {
      alert("Erro ao gerar slides.");
      console.error(error);
    } finally {
      setGerandoSlides(false);
    }
  }

  function handleDescartarSlides() {
    if (confirm("Tem certeza? Isso removerá os slides salvos.")) {
      if (slideResult?.id) removerSlides(slideResult.id);
      setSlideResult(null);
    }
  }

  return (
    <Page
      title={`Materiais - ${unidade.nome}`}
      subtitle={`${disciplina.nome} • ${disciplina.serieAno}`}
      actions={
        <Button variant="outline" onClick={onVoltar}>
          Voltar para Unidades
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Card Plano de Aula */}
        <Card title="Plano de Aula">
          {!plano ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-gray-500">Nenhum plano de aula gerado para esta unidade.</p>
              <Button onClick={handleGerarPlano} disabled={gerandoPlano}>
                {gerandoPlano ? "Gerando Plano com IA..." : "Gerar Plano de Aula"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {editandoPlano ? (
                <div className="flex flex-col gap-4">
                  <textarea
                    value={conteudoEditado}
                    onChange={(e) => setConteudoEditado(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-sans text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleCancelarEdicao}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarEdicao}>
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-md border border-gray-200 prose prose-sm max-w-none max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {plano.conteudo}
                    </pre>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      ✓ Salvo automaticamente
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleBaixarPlano}>
                        ⬇ Baixar
                      </Button>
                      <Button variant="secondary" onClick={handleIniciarEdicao}>
                        Editar
                      </Button>
                      <Button variant="ghost" onClick={handleDescartarPlano} className="text-red-600">
                        Excluir Plano
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Card Atividade Avaliativa */}
        <Card title="Atividade Avaliativa">
          {!atividade ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-gray-500">Nenhuma atividade gerada para esta unidade.</p>
              <Button onClick={handleGerarAtividade} disabled={gerandoAtividade}>
                {gerandoAtividade ? "Gerando Atividade com IA..." : "Gerar Atividade Avaliativa"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {editandoAtividade ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800 mb-2">
                    ⚠️ <strong>Atenção:</strong> Edite o conteúdo no formato técnico (JSON). Mantenha a estrutura correta (aspas, vírgulas) para evitar erros.
                  </div>
                  <textarea
                    value={conteudoAtividadeEditado}
                    onChange={(e) => setConteudoAtividadeEditado(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleCancelarEdicaoAtividade}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarEdicaoAtividade}>
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-md border border-gray-200 text-sm max-h-96 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-2">{atividade.conteudo?.title || "Atividade"}</h3>
                    <p className="mb-4 text-gray-700">{atividade.conteudo?.objective}</p>
                    
                    {atividade.conteudo?.questions?.map((q: any, i: number) => (
                      <div key={i} className="mb-6 p-3 bg-gray-50 rounded border border-gray-100">
                        <p className="font-semibold mb-2">{i + 1}. {q.enunciado}</p>
                        <ul className="space-y-1">
                          {q.alternativas?.map((alt: string, j: number) => (
                            <li key={j} className={`px-2 py-1 rounded ${alt.startsWith(q.correta) ? "bg-green-100 text-green-800" : ""}`}>
                              {alt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {atividade.downloadUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a 
                          href={atividade.downloadUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          📄 Baixar arquivo original (PDF/DOCX)
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      ✓ Salvo automaticamente
                    </span>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={handleIniciarEdicaoAtividade}>
                        Editar
                      </Button>
                      <Button variant="ghost" onClick={handleDescartarAtividade} className="text-red-600">
                        Excluir Atividade
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Card Slides */}
        <Card title="Slides de Apoio">
          <div className="flex flex-col gap-4">
             {!slideResult ? (
               <div className="flex flex-col items-center gap-4 py-8">
                 <p className="text-gray-500">Gere slides automáticos para esta unidade com o Presenton.</p>
                 <Button onClick={handleGerarSlides} disabled={gerandoSlides}>
                   {gerandoSlides ? "Gerando Slides..." : "Gerar Slides de Apoio"}
                 </Button>
               </div>
             ) : (
               <div className="flex flex-col gap-4">
                 <div className="bg-green-50 p-4 rounded border border-green-200">
                   <h3 className="font-bold text-green-800 mb-2">Slides Gerados com Sucesso!</h3>
                   <p className="text-sm text-green-700 mb-4">Sua apresentação foi criada e está pronta para uso.</p>
                   
                   <div className="flex flex-wrap gap-3">
                      {slideResult.edit_url && (
                        <a 
                          href={slideResult.edit_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          🖥️ Visualizar Online
                        </a>
                      )}
                      
                      {slideResult.pptx_url && (
                        <a 
                          href={slideResult.pptx_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                        >
                          💾 Baixar PowerPoint (.pptx)
                        </a>
                      )}

                      {slideResult.pdf_url && (
                        <a 
                          href={slideResult.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          📄 Baixar PDF
                        </a>
                      )}
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      ✓ Salvo automaticamente
                    </span>
                    <Button variant="ghost" onClick={handleDescartarSlides} className="text-red-600">
                      Excluir Slides
                    </Button>
                 </div>
               </div>
             )}
          </div>
        </Card>
      </div>
    </Page>
  );
}
