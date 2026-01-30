import { useCallback, useEffect, useState } from "react";
import type { Disciplina } from "../disciplinas/models";
import type { Unidade } from "../unidades/models";
import type {
  PlanoDeAula,
  LessonPlanContent,
  AtividadeAvaliativa,
  ActivityContent,
  Slide,
} from "./models";
import {
  gerarPlanoDeAula,
  buscarPlanoDaUnidade,
  salvarPlano,
  removerPlano,
  gerarAtividade,
  buscarAtividadeDaUnidade,
  salvarAtividade,
  removerAtividade,
  gerarSlides,
  buscarSlidesDaUnidade,
  salvarSlides,
  removerSlides,
  atualizarStatusPlano,
  atualizarStatusAtividade,
  atualizarStatusSlides,
} from "./services";

type MateriaisArgs = {
  unidade: Unidade | null;
  disciplina: Disciplina | null;
};

export function useMateriais({ unidade, disciplina }: MateriaisArgs) {
  const [plano, setPlano] = useState<PlanoDeAula | null>(null);
  const [atividade, setAtividade] = useState<AtividadeAvaliativa | null>(null);
  const [slides, setSlides] = useState<Slide | null>(null);
  const [loading, setLoading] = useState({
    plano: false,
    atividade: false,
    slides: false,
  });
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(() => {
    if (!unidade) return;
    setPlano(buscarPlanoDaUnidade(unidade.id));
    setAtividade(buscarAtividadeDaUnidade(unidade.id));
    setSlides(buscarSlidesDaUnidade(unidade.id));
  }, [unidade]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const gerarPlano = useCallback(async () => {
    if (!unidade || !disciplina) return;
    setLoading((s) => ({ ...s, plano: true }));
    setError(null);
    try {
      const response = await gerarPlanoDeAula(
        {
          disciplina: disciplina.nome,
          serieAno: disciplina.serieAno,
          unidade: unidade.nome,
          descricao: unidade.descricao ?? "",
        },
        unidade.id,
      );

      const novoPlano: PlanoDeAula = {
        id: (response as any).id ?? crypto.randomUUID(),
        unidadeId: unidade.id,
        conteudo: response.conteudo,
        downloadUrl: (response as any).downloadUrl,
        filename: (response as any).filename,
        dataGeracao: new Date().toISOString(),
        status: "andamento",
      };
      salvarPlano(novoPlano);
      setPlano(novoPlano);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar plano de aula");
    } finally {
      setLoading((s) => ({ ...s, plano: false }));
    }
  }, [disciplina, unidade]);

  const salvarPlanoEditado = useCallback((conteudo: LessonPlanContent) => {
    if (!plano) return;
    const atualizado: PlanoDeAula = {
      ...plano,
      conteudo,
      dataGeracao: new Date().toISOString(),
    };
    salvarPlano(atualizado);
    setPlano(atualizado);
  }, [plano]);

  const removerPlanoAtual = useCallback(() => {
    if (plano) {
      removerPlano(plano.id);
      setPlano(null);
    }
  }, [plano]);

  const marcarStatusPlano = useCallback((status: "andamento" | "concluida") => {
    if (!unidade || !plano) return;
    atualizarStatusPlano(unidade.id, status);
    setPlano({ ...plano, status });
  }, [plano, unidade]);

  const gerarAtividadeAtual = useCallback(async () => {
    if (!unidade || !disciplina) return;
    setLoading((s) => ({ ...s, atividade: true }));
    setError(null);
    try {
      const nova = await gerarAtividade(
        {
          disciplina: disciplina.nome,
          assunto: unidade.nome,
          nivel: disciplina.serieAno,
        },
        unidade.id,
      );
      salvarAtividade(nova);
      setAtividade(nova);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar atividade");
    } finally {
      setLoading((s) => ({ ...s, atividade: false }));
    }
  }, [disciplina, unidade]);

  const salvarAtividadeEditada = useCallback((conteudo: ActivityContent) => {
    if (!atividade) return;
    const atualizada: AtividadeAvaliativa = {
      ...atividade,
      conteudo,
      dataGeracao: new Date().toISOString(),
    };
    salvarAtividade(atualizada);
    setAtividade(atualizada);
  }, [atividade]);

  const removerAtividadeAtual = useCallback(() => {
    if (atividade) {
      removerAtividade(atividade.id);
      setAtividade(null);
    }
  }, [atividade]);

  const marcarStatusAtividade = useCallback((status: "andamento" | "concluida") => {
    if (!unidade || !atividade) return;
    atualizarStatusAtividade(unidade.id, status);
    setAtividade({ ...atividade, status });
  }, [atividade, unidade]);

  const gerarSlidesAtuais = useCallback(async () => {
    if (!unidade || !disciplina) return;
    setLoading((s) => ({ ...s, slides: true }));
    setError(null);
    try {
      const novos = await gerarSlides(
        {
          topic: unidade.nome,
          slides_count: 5,
          serieAno: disciplina.serieAno,
        },
        unidade.id,
      );
      salvarSlides(novos);
      setSlides(novos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar slides");
    } finally {
      setLoading((s) => ({ ...s, slides: false }));
    }
  }, [unidade]);

  const removerSlidesAtuais = useCallback(() => {
    if (slides) {
      removerSlides(slides.id);
      setSlides(null);
    }
  }, [slides]);

  const marcarStatusSlides = useCallback((status: "andamento" | "concluida") => {
    if (!unidade || !slides) return;
    atualizarStatusSlides(unidade.id, status);
    setSlides({ ...slides, status });
  }, [slides, unidade]);

  return {
    plano,
    atividade,
    slides,
    loadingPlano: loading.plano,
    loadingAtividade: loading.atividade,
    loadingSlides: loading.slides,
    error,
    reload: loadAll,
    gerarPlano,
    salvarPlanoEditado,
    marcarStatusPlano,
    removerPlano: removerPlanoAtual,
    gerarAtividade: gerarAtividadeAtual,
    salvarAtividadeEditada,
    marcarStatusAtividade,
    removerAtividade: removerAtividadeAtual,
    gerarSlides: gerarSlidesAtuais,
    marcarStatusSlides,
    removerSlides: removerSlidesAtuais,
  };
}
