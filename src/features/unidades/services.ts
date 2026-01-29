import type { Unidade } from "./models";
import { unidadeRepository } from "../../core/repositories/unidades";
import { suggestUnits } from "../rag/usecases";

export type UnitSuggestionRequest = {
  disciplina: string;
  serieAno: string;
};

export type UnitSuggestion = {
  nome: string;
  descricao: string;
};

export type UnitSuggestionResponse = {
  sugestoes: UnitSuggestion[];
};

export async function gerarSugestaoUnidades(
  request: UnitSuggestionRequest,
): Promise<UnitSuggestion[]> {
  const response = await suggestUnits(request);
  return response.sugestoes;
}

export function listarUnidades(): Unidade[] {
  return unidadeRepository.list();
}

export function buscarUnidade(id: string): Unidade | undefined {
  return unidadeRepository.get(id);
}

export function listarUnidadesDaDisciplina(disciplinaId: string): Unidade[] {
  return unidadeRepository.listByDisciplina(disciplinaId);
}

export function salvarUnidade(unidade: Unidade): void {
  unidadeRepository.upsert(unidade);
}

export function removerUnidade(id: string): void {
  unidadeRepository.remove(id);
}
