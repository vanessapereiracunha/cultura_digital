import type { Disciplina } from "../../features/disciplinas/models";
import { loadDisciplinas, saveDisciplinas } from "../storage/disciplinaStorage";

export const disciplinaRepository = {
  list(): Disciplina[] {
    return loadDisciplinas();
  },

  get(id: string): Disciplina | undefined {
    return loadDisciplinas().find((item) => item.id === id);
  },

  upsert(disciplina: Disciplina): void {
    const existentes = loadDisciplinas();
    const index = existentes.findIndex((item) => item.id === disciplina.id);
    if (index >= 0) {
      existentes[index] = disciplina;
    } else {
      existentes.push(disciplina);
    }
    saveDisciplinas(existentes);
  },

  remove(id: string): void {
    const filtradas = loadDisciplinas().filter((item) => item.id !== id);
    saveDisciplinas(filtradas);
  },
};
