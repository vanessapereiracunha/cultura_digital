import type { Unidade } from "./models";
import { loadUnidades, saveUnidades } from "../../core/storage/unidadeStorage";
import { postRag } from "../rag/infra";

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
  const response = await postRag<UnitSuggestionResponse>("/api/units/suggest", request);
  return response.sugestoes;
}

export function listarUnidades(): Unidade[] {
  return loadUnidades();
}

export function buscarUnidade(id: string): Unidade | undefined {
  return loadUnidades().find((u) => u.id === id);
}

export function listarUnidadesDaDisciplina(disciplinaId: string): Unidade[] {
  return loadUnidades().filter((unidade) => unidade.disciplinaId === disciplinaId);
}

export function salvarUnidade(unidade: Unidade): void {
  const existentes = loadUnidades();
  const indice = existentes.findIndex((item) => item.id === unidade.id);
  if (indice >= 0) {
    existentes[indice] = unidade;
  } else {
    existentes.push(unidade);
  }
  saveUnidades(existentes);
}

export function removerUnidade(id: string): void {
  const existentes = loadUnidades();
  const filtradas = existentes.filter((item) => item.id !== id);
  saveUnidades(filtradas);
}

