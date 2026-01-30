import { useCallback, useEffect, useState } from "react";
import type { Unidade } from "./models";
import { listarUnidadesDaDisciplina, salvarUnidade, removerUnidade, gerarSugestaoUnidades, atualizarStatusUnidade } from "./services";
import type { UnidadeStatus } from "./models";

type NovaUnidade = {
  nome: string;
  descricao?: string;
};

export function useUnidades(disciplina: { id: string; nome: string; serieAno: string } | null) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!disciplina) return;
    setUnidades(listarUnidadesDaDisciplina(disciplina.id));
  }, [disciplina]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const criar = useCallback((values: NovaUnidade) => {
    if (!disciplina) return;
    try {
      const nova: Unidade = {
        id: crypto.randomUUID(),
        disciplinaId: disciplina.id,
        nome: values.nome.trim(),
        descricao: values.descricao?.trim() || undefined,
        materiais: [],
        status: "pendente",
      };
      salvarUnidade(nova);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar unidade");
    }
  }, [disciplina, refresh]);

  const remover = useCallback((id: string) => {
    try {
      removerUnidade(id);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao remover unidade");
    }
  }, [refresh]);

  const sugerirComIA = useCallback(async () => {
    if (!disciplina) return;
    setLoadingIA(true);
    setError(null);
    try {
      const sugestoes = await gerarSugestaoUnidades({
        disciplina: disciplina.nome,
        serieAno: disciplina.serieAno,
      });
      for (const s of sugestoes) {
        const nova: Unidade = {
          id: crypto.randomUUID(),
          disciplinaId: disciplina.id,
        nome: s.nome,
        descricao: s.descricao,
        materiais: [],
        origem: "ia",
        status: "pendente",
      };
      salvarUnidade(nova);
    }
    refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar sugestões");
    } finally {
      setLoadingIA(false);
    }
  }, [disciplina, refresh]);

  return {
    unidades,
    loadingSugestoes: loadingIA,
    error,
    refresh,
    criarUnidade: criar,
    removerUnidade: remover,
    sugerirUnidades: sugerirComIA,
    atualizarStatus: (id: string, status: UnidadeStatus) => {
      atualizarStatusUnidade(id, status);
      refresh();
    },
  };
}
