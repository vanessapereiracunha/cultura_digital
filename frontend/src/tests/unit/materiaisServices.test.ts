import { gerarSlides } from '../../features/materiais/services';
import { generateSlides } from '../../features/rag/usecases';

// Mock das dependências
jest.mock('../../features/rag/usecases');
jest.mock('../../core/repositories/slides');

describe('Materiais Services', () => {
  beforeAll(() => {
    // Mock do crypto.randomUUID para ambiente de teste
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid-123',
      },
    });
  });

  it('deve gerar e formatar slides corretamente', async () => {
    const mockRequest = { topic: 'IA na Educação', slides_count: 5 };
    const mockResponse = {
      pptx_url: 'http://test.com/slides.pptx',
      pdf_url: 'http://test.com/slides.pdf',
      presentation_id: 'pres-123',
    };

    (generateSlides as jest.Mock).mockResolvedValue(mockResponse);

    const result = await gerarSlides(mockRequest as any, 'unidade-1');

    expect(result).toEqual({
      id: 'test-uuid-123',
      unidadeId: 'unidade-1',
      pptx_url: 'http://test.com/slides.pptx',
      pdf_url: 'http://test.com/slides.pdf',
      edit_url: undefined,
      presentation_id: 'pres-123',
      status: 'andamento',
      dataGeracao: expect.any(String),
    });
    expect(generateSlides).toHaveBeenCalledWith(mockRequest);
  });
});
