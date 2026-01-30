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
    const parsed = JSON.parse(raw) as Unidade[];
    // Backward compatibility: ensure status exists
    return parsed.map((item) => ({
      status: "pendente",
      ...item,
    }));
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
