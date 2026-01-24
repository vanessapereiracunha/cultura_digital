# ADR-001 — Arquitetura do Frontend e Integração com RAG

## Contexto

O projeto Cultura Digital é um sistema web single-user, sem autenticação, focado em geração de materiais didáticos alinhados à BNCC (RF01–RF06, HU e UC em `docs/`).

Já existe um serviço de RAG implementado em `/rag`, baseado em FastAPI + LlamaIndex + Llama, que indexa a BNCC e gera conteúdo (por exemplo, atividades avaliativas em PDF/DOCX).

Era necessário definir uma arquitetura simples e organizada para o frontend em `/src`, garantindo:

- baixo acoplamento entre UI, regras de negócio e RAG;
- facilidade de explicar o fluxo para a banca do hackathon;
- possibilidade de evoluir o front sem alterar o serviço RAG e vice-versa.

## Decisão

Adotar uma arquitetura de SPA em camadas, organizada por features, com o frontend em `/src` desacoplado do serviço RAG em `/rag`.

### Estrutura de diretórios em `/src`

- `src/app/`
  - `routes.ts`: definição das rotas/telas principais (disciplinas, unidades, materiais).
  - `layout.tsx`: layout base da aplicação (futuro uso).
  - `providers.tsx`: ponto único para providers globais (estado, tema, etc.).

- `src/features/disciplinas/`
  - `models.ts`: tipos de domínio de disciplina (`Disciplina`).
  - `services.ts`: casos de uso de RF01 (criar, listar, editar, remover disciplinas), orquestrando `storage`.
  - `ui.tsx`: componentes/telas relacionados a disciplinas.

- `src/features/unidades/`
  - `models.ts`: tipos de domínio de unidade (`Unidade`, origem manual ou IA).
  - `services.ts`: casos de uso de RF02/RF03 (criar unidade manual, salvar unidades sugeridas).
  - `ui.tsx`: componentes/telas para unidades.

- `src/features/materiais/`
  - `models.ts`: modelos de saída de materiais (`PlanoDeAula`, `AtividadeAvaliativa`, `SlideDeck`).
  - `services.ts`: casos de uso de RF04/RF05/RF06 (gerar plano, atividade, slides) chamando os serviços de RAG.
  - `ui.tsx`: tela de exibição dos materiais gerados.

- `src/features/rag/`
  - `infra.ts`: cliente HTTP especializado para o backend RAG (`postRag`).
  - `services.ts`: fachada de domínio do ponto de vista do front (por exemplo, `sugerirUnidades`, `gerarPlano`, `gerarAtividade`).

- `src/core/`
  - `config/api.ts`: configuração de base URL do RAG (`RAG_BASE_URL`).
  - `http/client.ts`: wrapper de HTTP (`httpClient`) que centraliza `fetch`, headers e tratamento de erro.
  - `storage/`
    - `disciplinaStorage.ts`: persistência local das disciplinas (`localStorage`).
    - `unidadeStorage.ts`: persistência local das unidades (`localStorage`).

Esta estrutura garante separação entre:

- UI (`ui.tsx`), que lida apenas com input/output do professor;
- serviços de aplicação por feature (`services.ts`), que encapsulam casos de uso e orquestram storage + RAG;
- infraestrutura de acesso (`core/http`, `core/storage`, `features/rag/infra`), que concentra detalhes técnicos.

### Integração com o serviço RAG em `/rag`

- O frontend **não chama diretamente** Llama ou LlamaIndex.
- Toda integração com IA é feita via HTTP, usando o cliente especializado em `src/features/rag/infra.ts`.
- O fluxo típico é:
  - UI → `services` da feature → `features/rag/services` → `features/rag/infra` → API FastAPI em `/rag`.
- Do lado do backend RAG, os endpoints seguem a linha:
  - `POST /api/units/suggest`: sugestões de unidades (RF03);
  - `POST /api/lesson-plan/generate`: plano de aula (RF04);
  - `POST /api/activity/generate`: atividade avaliativa (RF05, já implementado em `/rag`);
  - `POST /api/slides/generate` (opcional, RF06).

## Alternativas consideradas

1. Organizar o frontend por camada técnica (pasta `components`, `services`, `store` globais)
   - Rejeitado para este contexto porque dificulta a visualização de cada RF/HU/UC como uma feature isolada e aumenta o acoplamento entre partes da UI.

2. Integrar o frontend diretamente com a API de Llama (sem serviço RAG separado)
   - Rejeitado por questões de segurança (exposição de chave de API) e por reduzir a clareza arquitetural para a banca, além de dificultar o alinhamento pedagógico com a BNCC (RAG ficaria espalhado no front).

3. Colocar toda a lógica de RAG diretamente dentro do frontend
   - Rejeitado para manter o princípio de separação de responsabilidades: `/rag` concentra indexação BNCC, retrieval e prompts pedagógicos; `/src` apenas consome endpoints de alto nível.

## Consequências

### Positivas

- Arquitetura simples, mas suficientemente desacoplada para ser explicável em poucos minutos para a banca.
- Cada requisito funcional (RF01–RF06) e caso de uso (UC01–UC06) pode ser mapeado diretamente para uma `feature` em `/src/features`.
- A substituição do modelo de IA, do provedor de Llama ou da forma de indexação da BNCC pode ser feita alterando apenas o projeto `/rag`, sem mexer no frontend.
- A evolução da UI (refatorar componentes, mudar layout ou biblioteca) não exige mudanças no serviço RAG, desde que os contratos HTTP sejam preservados.

### Negativas / trade-offs

- Existe uma certa duplicação de conceitos entre `/src` (tipos e serviços) e `/rag` (schemas de entrada/saída), exigindo atenção à documentação e aos contratos.
- Para um projeto muito pequeno, a divisão em múltiplas pastas por feature pode parecer “mais camadas” do que o estritamente necessário, mas foi escolhida para favorecer clareza e organização frente à banca.

## Relação com documentos do projeto

- Alinha-se diretamente à visão de arquitetura em `docs/ARQUITETURA.md` (camadas: UI Web, Camada de Serviços, Camada RAG, Base de Conhecimento).
- Atende aos requisitos do edital em `docs/hackaton/EDITAL.md` no que diz respeito a:
  - simplicidade da aplicação web (single-user);
  - uso de RAG para garantir alinhamento à BNCC;
  - organização do código e da arquitetura, facilitando explicação para a banca.