export type OrigemUnidade = "manual" | "ia";

export type Material = {
  id: string;
  titulo: string;
  tipo: "pdf" | "docx";
  url: string;
};

export type Unidade = {
  id: string;
  disciplinaId: string;
  nome: string;
  descricao?: string;
  materiais: Material[];
  origem?: OrigemUnidade;
};
