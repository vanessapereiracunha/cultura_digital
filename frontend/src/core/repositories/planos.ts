import type { PlanoDeAula } from "../../features/materiais/models";
import { loadPlanos, savePlanos } from "../storage/materiaisStorage";

export const planoRepository = {
  list(): PlanoDeAula[] {
    return loadPlanos();
  },

  get(id: string): PlanoDeAula | undefined {
    return loadPlanos().find((item) => item.id === id);
  },

  getByUnidade(unidadeId: string): PlanoDeAula | undefined {
    return loadPlanos().find((item) => item.unidadeId === unidadeId);
  },

  upsert(plano: PlanoDeAula): void {
    const existentes = loadPlanos();
    const index = existentes.findIndex((item) => item.id === plano.id || item.unidadeId === plano.unidadeId);
    if (index >= 0) {
      existentes[index] = plano;
    } else {
      existentes.push(plano);
    }
    savePlanos(existentes);
  },

  remove(id: string): void {
    const filtrados = loadPlanos().filter((item) => item.id !== id);
    savePlanos(filtrados);
  },
};
