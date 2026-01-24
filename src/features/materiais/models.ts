export type PlanoDeAula = {
  id: string;
  unidadeId: string;
  conteudo: string; // Markdown
  dataGeracao: string;
};

export type AtividadeAvaliativa = {
  id: string;
  unidadeId: string;
  conteudo: any; // JSON estruturado
  downloadUrl: string;
  dataGeracao: string;
};

export type Slide = {
  id: string;
  unidadeId: string;
  pptx_url?: string;
  pdf_url?: string;
  edit_url?: string;
  presentation_id?: string;
  dataGeracao: string;
};

export type LessonPlanRequest = {
  disciplina: string;
  serieAno: string;
  unidade: string;
  descricao: string;
};

export type LessonPlanResponse = {
  conteudo: string;
};
