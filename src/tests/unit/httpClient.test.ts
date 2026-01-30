import { httpClient } from '../../core/http/client';

describe('httpClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deve fazer uma requisição GET com sucesso', async () => {
    const mockData = { id: 1, name: 'Teste' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await httpClient.get('http://api.test/data');

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('http://api.test/data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('deve fazer uma requisição POST com corpo', async () => {
    const mockBody = { title: 'Novo Post' };
    const mockResponse = { id: 2, ...mockBody };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await httpClient.post('http://api.test/data', mockBody);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://api.test/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockBody),
    });
  });

  it('deve lançar erro quando a resposta não for ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ detail: 'Não encontrado' }),
    });

    await expect(httpClient.get('http://api.test/notfound')).rejects.toThrow('Não encontrado');
  });

  it('deve usar mensagem genérica se o JSON de erro não tiver detail', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(httpClient.get('http://api.test/error')).rejects.toThrow('Erro HTTP 500');
  });
});
