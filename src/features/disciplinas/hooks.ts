import { useCallback, useEffect, useState } from "react";
import type { Disciplina } from "./models";
import { listarDisciplinas, salvarDisciplina, removerDisciplina } from "./services";

type NovaDisciplina = {
  nome: string;
  serieAno: string;
  assunto?: string;
};

export function useDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setDisciplinas(listarDisciplinas());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const criar = useCallback((values: NovaDisciplina) => {
    try {
      const nova: Disciplina = {
        id: crypto.randomUUID(),
        nome: values.nome.trim(),
        serieAno: values.serieAno.trim(),
        assunto: values.assunto?.trim() || undefined,
      };
      salvarDisciplina(nova);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar disciplina");
    }
  }, [refresh]);

  const remover = useCallback((id: string) => {
    try {
      removerDisciplina(id);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao remover disciplina");
    }
  }, [refresh]);

  return {
    disciplinas,
    error,
    refresh,
    criarDisciplina: criar,
    removerDisciplina: remover,
  };
}
