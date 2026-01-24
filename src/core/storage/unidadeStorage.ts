import type { Unidade } from "../../features/unidades/models";

const KEY = "cultura_digital_unidades";

export function loadUnidades(): Unidade[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Unidade[];
  } catch {
    return [];
  }
}

export function saveUnidades(value: Unidade[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(KEY, JSON.stringify(value));
}