import { Slide } from "../../features/materiais/models";

const SLIDES_STORAGE_KEY = "cultura_digital_slides";

export function loadSlides(): Slide[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(SLIDES_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as Slide[];
    return parsed.map((s) => ({
      ...s,
      status: s.status ?? "andamento",
    }));
  } catch (error) {
    console.error("Erro ao carregar slides:", error);
    return [];
  }
}

export function saveSlides(slides: Slide[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
}
