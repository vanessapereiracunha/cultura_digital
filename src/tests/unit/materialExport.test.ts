import { buildLessonPlanHtml } from '../../shared/utils/materialExport';
import { mockLessonPlan, mockLessonPlanParams } from '../mocks/lessonPlan';

describe('buildLessonPlanHtml', () => {
  it('deve gerar o HTML contendo o título da aula', () => {
    const html = buildLessonPlanHtml(mockLessonPlanParams as any);
    expect(html).toContain('Aula de Teste');
  });

  it('deve usar o nome da unidade se o título estiver vazio', () => {
    const paramsSemTitulo = {
      ...mockLessonPlanParams,
      conteudo: { ...mockLessonPlan, titulo: '' },
      unidadeNome: 'Unidade de Emergência'
    };
    const html = buildLessonPlanHtml(paramsSemTitulo as any);
    expect(html).toContain('Unidade de Emergência');
  });

  it('deve listar todos os objetivos de aprendizagem', () => {
    const html = buildLessonPlanHtml(mockLessonPlanParams as any);
    expect(html).toContain('Objetivo 1');
    expect(html).toContain('Objetivo 2');
  });

  it('deve incluir a disciplina e série no cabeçalho', () => {
    const html = buildLessonPlanHtml(mockLessonPlanParams as any);
    expect(html).toContain('DISCIPLINA: Matemática');
    expect(html).toContain('SÉRIE/ANO: 5º Ano');
  });
});
