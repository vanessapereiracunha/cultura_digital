export const SERIES_ESCOLARES = [
  "1º Ano Fundamental",
  "2º Ano Fundamental",
  "3º Ano Fundamental",
  "4º Ano Fundamental",
  "5º Ano Fundamental",
  "6º Ano Fundamental",
  "7º Ano Fundamental",
  "8º Ano Fundamental",
  "9º Ano Fundamental",
  "1ª Série Ensino Médio",
  "2ª Série Ensino Médio",
  "3ª Série Ensino Médio",
] as const;

export const OPCOES_SERIES = [
  {
    label: "Ensino Fundamental - Anos Iniciais",
    options: [
      { label: "1º Ano", value: "1º Ano Fundamental" },
      { label: "2º Ano", value: "2º Ano Fundamental" },
      { label: "3º Ano", value: "3º Ano Fundamental" },
      { label: "4º Ano", value: "4º Ano Fundamental" },
      { label: "5º Ano", value: "5º Ano Fundamental" },
    ]
  },
  {
    label: "Ensino Fundamental - Anos Finais",
    options: [
      { label: "6º Ano", value: "6º Ano Fundamental" },
      { label: "7º Ano", value: "7º Ano Fundamental" },
      { label: "8º Ano", value: "8º Ano Fundamental" },
      { label: "9º Ano", value: "9º Ano Fundamental" },
    ]
  },
  {
    label: "Ensino Médio",
    options: [
      { label: "1ª Série", value: "1ª Série Ensino Médio" },
      { label: "2ª Série", value: "2ª Série Ensino Médio" },
      { label: "3ª Série", value: "3ª Série Ensino Médio" },
    ]
  }
];

export const DISCIPLINAS_ESCOLARES = [
  "Artes",
  "Biologia",
  "Ciências",
  "Educação Física",
  "Filosofia",
  "Física",
  "Geografia",
  "História",
  "Inglês",
  "Língua Portuguesa",
  "Matemática",
  "Química",
  "Sociologia",
  "Projeto de Vida",
  "Cultura Digital",
  "Tecnologia e Inovação",
];

export type SerieEscolar = (typeof SERIES_ESCOLARES)[number];
