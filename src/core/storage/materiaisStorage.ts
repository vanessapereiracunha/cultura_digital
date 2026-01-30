import { PlanoDeAula, AtividadeAvaliativa } from "../../features/materiais/models";

const PLANOS_STORAGE_KEY = "cultura_digital_planos";
const ATIVIDADES_STORAGE_KEY = "cultura_digital_atividades";

export function loadPlanos(): PlanoDeAula[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(PLANOS_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as PlanoDeAula[];
    return parsed.map((p) => ({
      status: "andamento",
      ...p,
    }));
  } catch (error) {
    console.error("Erro ao carregar planos de aula:", error);
    return [];
  }
}

export function savePlanos(planos: PlanoDeAula[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANOS_STORAGE_KEY, JSON.stringify(planos));
}

export function loadAtividades(): AtividadeAvaliativa[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ATIVIDADES_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as AtividadeAvaliativa[];
    return parsed.map((a) => ({
      status: "andamento",
      ...a,
    }));
  } catch (error) {
    console.error("Erro ao carregar atividades:", error);
    return [];
  }
}

export function saveAtividades(atividades: AtividadeAvaliativa[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ATIVIDADES_STORAGE_KEY, JSON.stringify(atividades));
}
