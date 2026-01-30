import type { Unidade } from "./models";
import { unidadeRepository } from "../../core/repositories/unidades";
import { suggestUnits } from "../rag/usecases";
import type { UnidadeStatus } from "./models";

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

export function atualizarStatusUnidade(id: string, status: UnidadeStatus): void {
  const unidade = unidadeRepository.get(id);
  if (!unidade) return;
  unidadeRepository.upsert({ ...unidade, status });
}
