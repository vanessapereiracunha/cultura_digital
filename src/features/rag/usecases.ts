import { postRag } from "./infra";
import type {
  ActivityRequest,
  ActivityResponse,
} from "./services";
import type { LessonPlanRequest, LessonPlanResponse, SlideRequest, SlideResponse } from "../materiais/models";
import type {
  UnitSuggestionRequest,
  UnitSuggestionResponse,
} from "../unidades/services";

export async function generateActivity(request: ActivityRequest): Promise<ActivityResponse> {
  return postRag<ActivityResponse>("/api/activity/generate", {
    disciplina: request.disciplina,
    assunto: request.assunto,
    nivel: request.nivel,
    format: request.formato ?? "pdf",
  });
}

export async function generateLessonPlan(request: LessonPlanRequest): Promise<LessonPlanResponse> {
  return postRag<LessonPlanResponse>("/api/units/lesson-plan", request);
}

export async function generateSlides(request: SlideRequest): Promise<SlideResponse> {
  const body = {
    topic: request.topic,
    slides_count: request.slides_count ?? 8,
    language: "pt-BR",
  };
  return postRag<SlideResponse>("/api/slides/generate", body);
}

export async function suggestUnits(request: UnitSuggestionRequest): Promise<UnitSuggestionResponse> {
  return postRag<UnitSuggestionResponse>("/api/units/suggest", request);
}
