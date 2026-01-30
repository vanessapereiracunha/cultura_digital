export type LessonPlanContent = {
  titulo: string;
  duracao: string;
  serieAno: string;
  objetivos: string[];
  conteudoProgramatico: string[];
  estrategiasEnsino: string[];
  bncc?: string[];
  avaliacao?: string;
  recursos?: string[];
  referencias?: string[];
};

export type ActivityQuestion = {
  enunciado: string;
  alternativas: string[];
  correta: string;
};

export type ActivityContent = {
  title: string;
  objective?: string;
  content?: string;
  bncc_skills?: string[];
  questions?: ActivityQuestion[];
};

export type PlanoDeAula = {
  id: string;
  unidadeId: string;
  conteudo: LessonPlanContent;
  downloadUrl?: string;
  filename?: string;
  dataGeracao: string;
  status?: "pendente" | "andamento" | "concluida";
};

export type AtividadeAvaliativa = {
  id: string;
  unidadeId: string;
  conteudo: ActivityContent;
  downloadUrl: string;
  dataGeracao: string;
  status?: "pendente" | "andamento" | "concluida";
};

export type Slide = {
  id: string;
  unidadeId: string;
  pptx_url?: string;
  pdf_url?: string;
  edit_url?: string;
  presentation_id?: string;
  dataGeracao: string;
  status?: "pendente" | "andamento" | "concluida";
};

export type SlideRequest = {
  topic: string;
  slides_count?: number;
  serieAno?: string;
};

export type SlideResponse = {
  pptx_url?: string;
  pdf_url?: string;
  edit_url?: string;
  presentation_id?: string;
  [key: string]: any;
};

export type LessonPlanRequest = {
  disciplina: string;
  serieAno: string;
  unidade: string;
  descricao: string;
};

export type LessonPlanResponse = {
  conteudo: LessonPlanContent;
};
