import type { LessonPlanRequest, LessonPlanResponse, PlanoDeAula, AtividadeAvaliativa, Slide, SlideRequest } from "./models";
import { planoRepository } from "../../core/repositories/planos";
import { atividadeRepository } from "../../core/repositories/atividades";
import { slidesRepository } from "../../core/repositories/slides";
import { generateActivity, generateLessonPlan, generateSlides } from "../rag/usecases";

export async function gerarSlides(request: SlideRequest, unidadeId: string): Promise<Slide> {
  const response = await generateSlides(request);
  
  return {
    id: crypto.randomUUID(),
    unidadeId,
    pptx_url: response.pptx_url || response.download_url, // Fallback
    pdf_url: response.pdf_url,
    edit_url: response.edit_url || response.url, // Fallback
    presentation_id: response.presentation_id,
    dataGeracao: new Date().toISOString(),
  };
}

export function buscarSlidesDaUnidade(unidadeId: string): Slide | null {
  return slidesRepository.getByUnidade(unidadeId) || null;
}

export function salvarSlides(slide: Slide): void {
  slidesRepository.upsert(slide);
}

export function removerSlides(id: string): void {
  slidesRepository.remove(id);
}

export async function gerarPlanoDeAula(
  request: LessonPlanRequest,
  unidadeId: string
): Promise<LessonPlanResponse> {
  void unidadeId;
  return generateLessonPlan(request);
}

export function buscarPlanoDaUnidade(unidadeId: string): PlanoDeAula | null {
  return planoRepository.getByUnidade(unidadeId) || null;
}

export function salvarPlano(plano: PlanoDeAula): void {
  planoRepository.upsert(plano);
}

export function removerPlano(id: string): void {
  planoRepository.remove(id);
}

// --- Atividades ---

export async function gerarAtividade(
  request: { disciplina: string; assunto: string; nivel: string },
  unidadeId: string
): Promise<AtividadeAvaliativa> {
  const response = await generateActivity(request);
  
  return {
    id: crypto.randomUUID(),
    unidadeId,
    conteudo: response.content || {},
    downloadUrl: response.download_url,
    dataGeracao: new Date().toISOString(),
  };
}

export function buscarAtividadeDaUnidade(unidadeId: string): AtividadeAvaliativa | null {
  return atividadeRepository.getByUnidade(unidadeId) || null;
}

export function salvarAtividade(atividade: AtividadeAvaliativa): void {
  atividadeRepository.upsert(atividade);
}

export function removerAtividade(id: string): void {
  atividadeRepository.remove(id);
}
