import type { AtividadeAvaliativa } from "../../features/materiais/models";
import { loadAtividades, saveAtividades } from "../storage/materiaisStorage";

export const atividadeRepository = {
  list(): AtividadeAvaliativa[] {
    return loadAtividades();
  },

  get(id: string): AtividadeAvaliativa | undefined {
    return loadAtividades().find((item) => item.id === id);
  },

  getByUnidade(unidadeId: string): AtividadeAvaliativa | undefined {
    return loadAtividades().find((item) => item.unidadeId === unidadeId);
  },

  upsert(atividade: AtividadeAvaliativa): void {
    const existentes = loadAtividades();
    const index = existentes.findIndex((item) => item.id === atividade.id || item.unidadeId === atividade.unidadeId);
    if (index >= 0) {
      existentes[index] = atividade;
    } else {
      existentes.push(atividade);
    }
    saveAtividades(existentes);
  },

  remove(id: string): void {
    const filtradas = loadAtividades().filter((item) => item.id !== id);
    saveAtividades(filtradas);
  },
};
