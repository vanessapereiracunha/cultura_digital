import { postRag } from "../rag/infra";
import { gerarAtividadeRemota } from "../rag/services";
import type { LessonPlanRequest, LessonPlanResponse, PlanoDeAula, AtividadeAvaliativa, Slide } from "./models";
import { loadPlanos, savePlanos, loadAtividades, saveAtividades } from "../../core/storage/materiaisStorage";
import { loadSlides, saveSlides } from "../../core/storage/slidesStorage";

// --- Slides ---
export type SlideRequest = {
  topic: string;
  slides_count?: number;
};

export type SlideResponse = {
  pptx_url?: string;
  pdf_url?: string;
  edit_url?: string;
  presentation_id?: string;
  [key: string]: any;
};

export async function gerarSlides(request: SlideRequest, unidadeId: string): Promise<Slide> {
  const body = {
    topic: request.topic,
    slides_count: request.slides_count ?? 8,
    language: "pt-BR",
  };
  
  const response = await postRag<SlideResponse>("/api/slides/generate", body);
  
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
  const slides = loadSlides();
  return slides.find((s) => s.unidadeId === unidadeId) || null;
}

export function salvarSlides(slide: Slide): void {
  const slides = loadSlides();
  const index = slides.findIndex((s) => s.unidadeId === slide.unidadeId);
  
  if (index >= 0) {
    slides[index] = slide;
  } else {
    slides.push(slide);
  }
  
  saveSlides(slides);
}

export function removerSlides(id: string): void {
  const slides = loadSlides();
  const filtered = slides.filter((s) => s.id !== id);
  saveSlides(filtered);
}

export async function gerarPlanoDeAula(
  request: LessonPlanRequest,
  unidadeId: string
): Promise<PlanoDeAula> {
  const response = await postRag<LessonPlanResponse>("/api/units/lesson-plan", request);
  
  return {
    id: crypto.randomUUID(),
    unidadeId,
    conteudo: response.conteudo,
    dataGeracao: new Date().toISOString(),
  };
}

export function buscarPlanoDaUnidade(unidadeId: string): PlanoDeAula | null {
  const planos = loadPlanos();
  return planos.find((p) => p.unidadeId === unidadeId) || null;
}

export function salvarPlano(plano: PlanoDeAula): void {
  const planos = loadPlanos();
  const index = planos.findIndex((p) => p.unidadeId === plano.unidadeId);
  
  if (index >= 0) {
    planos[index] = plano;
  } else {
    planos.push(plano);
  }
  
  savePlanos(planos);
}

export function removerPlano(id: string): void {
  const planos = loadPlanos();
  const filtered = planos.filter((p) => p.id !== id);
  savePlanos(filtered);
}

// --- Atividades ---

export async function gerarAtividade(
  request: { disciplina: string; assunto: string; nivel: string },
  unidadeId: string
): Promise<AtividadeAvaliativa> {
  const response = await gerarAtividadeRemota(request);
  
  return {
    id: crypto.randomUUID(),
    unidadeId,
    conteudo: response.content || {},
    downloadUrl: response.download_url,
    dataGeracao: new Date().toISOString(),
  };
}

export function buscarAtividadeDaUnidade(unidadeId: string): AtividadeAvaliativa | null {
  const atividades = loadAtividades();
  return atividades.find((a) => a.unidadeId === unidadeId) || null;
}

export function salvarAtividade(atividade: AtividadeAvaliativa): void {
  const atividades = loadAtividades();
  const index = atividades.findIndex((a) => a.unidadeId === atividade.unidadeId);
  
  if (index >= 0) {
    atividades[index] = atividade;
  } else {
    atividades.push(atividade);
  }
  
  saveAtividades(atividades);
}

export function removerAtividade(id: string): void {
  const atividades = loadAtividades();
  const filtered = atividades.filter((a) => a.id !== id);
  saveAtividades(filtered);
}

