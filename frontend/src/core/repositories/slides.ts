import type { Slide } from "../../features/materiais/models";
import { loadSlides, saveSlides } from "../storage/slidesStorage";

export const slidesRepository = {
  list(): Slide[] {
    return loadSlides();
  },

  get(id: string): Slide | undefined {
    return loadSlides().find((item) => item.id === id);
  },

  getByUnidade(unidadeId: string): Slide | undefined {
    return loadSlides().find((item) => item.unidadeId === unidadeId);
  },

  upsert(slide: Slide): void {
    const existentes = loadSlides();
    const index = existentes.findIndex((item) => item.id === slide.id || item.unidadeId === slide.unidadeId);
    if (index >= 0) {
      existentes[index] = slide;
    } else {
      existentes.push(slide);
    }
    saveSlides(existentes);
  },

  remove(id: string): void {
    const filtrados = loadSlides().filter((item) => item.id !== id);
    saveSlides(filtrados);
  },
};
