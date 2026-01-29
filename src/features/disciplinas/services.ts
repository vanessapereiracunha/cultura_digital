import type { Disciplina } from "./models";
import { disciplinaRepository } from "../../core/repositories/disciplinas";

export function listarDisciplinas(): Disciplina[] {
  return disciplinaRepository.list();
}

export function buscarDisciplina(id: string): Disciplina | undefined {
  return disciplinaRepository.get(id);
}

export function salvarDisciplina(disciplina: Disciplina): void {
  disciplinaRepository.upsert(disciplina);
}

export function removerDisciplina(id: string): void {
  disciplinaRepository.remove(id);
}