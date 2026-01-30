import type { Unidade } from "../../features/unidades/models";
import { loadUnidades, saveUnidades } from "../storage/unidadeStorage";

export const unidadeRepository = {
  list(): Unidade[] {
    return loadUnidades();
  },

  listByDisciplina(disciplinaId: string): Unidade[] {
    return loadUnidades().filter((item) => item.disciplinaId === disciplinaId);
  },

  get(id: string): Unidade | undefined {
    return loadUnidades().find((item) => item.id === id);
  },

  upsert(unidade: Unidade): void {
    const existentes = loadUnidades();
    const index = existentes.findIndex((item) => item.id === unidade.id);
    if (index >= 0) {
      existentes[index] = unidade;
    } else {
      existentes.push(unidade);
    }
    saveUnidades(existentes);
  },

  remove(id: string): void {
    const filtradas = loadUnidades().filter((item) => item.id !== id);
    saveUnidades(filtradas);
  },
};
