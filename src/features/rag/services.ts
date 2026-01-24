import { postRag } from "./infra";

export type ActivityRequest = {
  disciplina: string;
  assunto: string;
  nivel: string;
  formato?: "pdf" | "docx";
};

export type ActivityResponse = {
  download_url: string;
  filename: string;
  content?: any;
};

export async function gerarAtividadeRemota(
  request: ActivityRequest,
): Promise<ActivityResponse> {
  const body = {
    disciplina: request.disciplina,
    assunto: request.assunto,
    nivel: request.nivel,
    format: request.formato ?? "pdf",
  };

  return postRag<ActivityResponse>("/api/activity/generate", body);
}
