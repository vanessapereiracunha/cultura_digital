import type { Disciplina } from "./models";
import { loadDisciplinas, saveDisciplinas } from "../../core/storage/disciplinaStorage";

export function listarDisciplinas(): Disciplina[] {
  return loadDisciplinas();
}

export function buscarDisciplina(id: string): Disciplina | undefined {
  return loadDisciplinas().find((d) => d.id === id);
}

export function salvarDisciplina(disciplina: Disciplina): void {
  const existentes = loadDisciplinas();
  const indice = existentes.findIndex((item) => item.id === disciplina.id);
  if (indice >= 0) {
    existentes[indice] = disciplina;
  } else {
    existentes.push(disciplina);
  }
  saveDisciplinas(existentes);
}

export function removerDisciplina(id: string): void {
  const existentes = loadDisciplinas();
  const filtradas = existentes.filter((item) => item.id !== id);
  saveDisciplinas(filtradas);
}
