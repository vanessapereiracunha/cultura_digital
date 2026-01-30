import type { Disciplina } from "../../features/disciplinas/models";

const KEY = "cultura_digital_disciplinas";

export function loadDisciplinas(): Disciplina[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Disciplina[];
  } catch {
    return [];
  }
}

export function saveDisciplinas(value: Disciplina[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(KEY, JSON.stringify(value));
}