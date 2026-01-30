# Cultura Digital — Protótipo de Geração de Materiais Didáticos com IA

Este repositório contém um projeto desenvolvido para o Hackathon do IFPI — Campus Piripiri.  
O objetivo do hackathon é selecionar a melhor proposta de sistema web **single-user** para geração de materiais didáticos de Cultura Digital alinhados à BNCC, com possibilidade de contratação futura para desenvolvimento do sistema completo.

---

## Visão Geral

O sistema Cultura Digital tem como foco apoiar o planejamento pedagógico de professores da Educação Básica, permitindo:

- Cadastro e gerenciamento de disciplinas.
- Criação manual de unidades (aulas).
- Sugestão automática de unidades via IA.
- Geração de plano de aula alinhado à BNCC.
- Geração de atividades avaliativas coerentes com cada aula.
- (Opcional) Geração de slides de apoio.

Toda a solução é pensada para **uso individual (single-user)**, sem autenticação ou controle de múltiplos usuários, conforme descrito no edital do hackathon.

---

## Funcionalidades (RF)

Os requisitos funcionais principais estão detalhados em [`docs/RF.md`](./docs/RF.md):

- **RF01 — Cadastro e gerenciamento de disciplinas**  
  Cadastrar, editar, listar e remover disciplinas (ex.: Matemática, Ciências, História).

- **RF02 — Criação manual de unidades (aulas)**  
  Criar unidades manualmente, informando tema da aula e série/ano.

- **RF03 — Sugestão automática de unidades via IA**  
  Sugerir unidades com base em disciplina, série/ano e diretrizes da BNCC.

- **RF04 — Geração automática de plano de aula**  
  Gerar plano de aula alinhado à BNCC para cada unidade.

- **RF05 — Geração automática de atividade avaliativa**  
  Gerar atividade/tarefa avaliativa coerente com a unidade.

- **RF06 (Opcional) — Geração de slides**  
  Gerar slides de apoio para cada unidade/aula.

Histórias de usuário e casos de uso estão em:

- [`docs/HU.md`](./docs/HU.md) — Histórias de Usuário  
- [`docs/UC.md`](./docs/UC.md) — Casos de Uso

---

## Papel da IA na Solução

Conforme o edital do hackathon, a Inteligência Artificial é utilizada como **ferramenta de apoio** ao professor, nunca como substituição da prática docente.

Papel da IA neste projeto:

- Utilizar **Recuperação Aumentada por Geração (RAG)** para:
  - recuperar trechos relevantes da BNCC e de documentos oficiais do MEC,
  - fornecer contexto pedagógico ao modelo de linguagem (Llama).
- Gerar:
  - sugestões de unidades alinhadas à BNCC,
  - planos de aula estruturados,
  - atividades avaliativas,
  - slides de apoio (opcional).

Cuidados adotados:

- O modelo é orientado a **respeitar a BNCC** e as diretrizes do MEC.  
- O professor continua responsável por revisar, adaptar e validar o material gerado.  
- O uso de IA é descrito explicitamente na documentação e será apresentado à banca, conforme o edital.

Mais detalhes sobre o edital em [`docs/hackaton/EDITAL.md`](./docs/hackaton/EDITAL.md).

---

## Estrutura de Documentação

Principais arquivos de documentação deste projeto:

- `docs/RF.md` — Requisitos Funcionais  
- `docs/HU.md` — Histórias de Usuário  
- `docs/UC.md` — Casos de Uso  
- `docs/ARQUITETURA.md` — Visão de Arquitetura (proposta para o sistema)  
- `docs/SPRINTS.md` — Planejamento de Sprints  
- `docs/hackaton/EDITAL.md` — Edital completo do hackathon  
- `docs/github/PATTERN.md` — Padrão de commits, branches, PRs e merges

---

## Tecnologias e Arquitetura

O projeto utiliza uma arquitetura moderna e modular, dividida entre Frontend e Backend:

### **Frontend**
Desenvolvido com **React (Vite)** e **TypeScript**, seguindo uma organização **Feature-Based**:
- **Features (`src/features`)**: Código organizado por domínios de negócio (Disciplinas, Unidades, Materiais). Cada feature encapsula seus próprios componentes, hooks e serviços.
- **Core (`src/core`)**: Camada de infraestrutura que gerencia a comunicação HTTP e a persistência de dados local (Repositories).
- **Shared (`src/shared`)**: Componentes de interface (UI) e utilitários reutilizáveis em toda a aplicação.
- **Tailwind CSS**: Utilizado para uma estilização rápida e responsiva.

### **Backend**
Construído com **FastAPI (Python)**, estruturado em camadas de responsabilidade:
- **API (Routers)**: Endpoints que expõem as funcionalidades para o frontend.
- **Services**: Lógica de negócio e geradores de arquivos (PDF/DOCX).
- **Engine (RAG)**: O núcleo de inteligência que utiliza **LlamaIndex** para:
    - **Indexação**: Processamento e vetorização dos documentos oficiais.
    - **Recuperação Contextual**: Busca inteligente baseada em semântica e filtros de metadados.
    - **Integração com LLM**: Orquestração das chamadas ao modelo Gemini (Google).

---

## Como Rodar o Projeto

### 1. Clonar o Repositório
Primeiro, clone o repositório para sua máquina local:
```bash
git clone (https://github.com/watusalen/cultura_digital.git)
cd cultura_digital
```

### 2. Pré-requisitos
Certifique-se de ter instalado:
- Python 3.11 ou superior.
- Node.js (v18+) e npm.
- [Poetry](https://python-poetry.org/) para gerenciamento de dependências Python.

### 3. Configuração do Backend
Navegue até a pasta do backend e instale as dependências:
```bash
cd backend
poetry install
```
Configure as variáveis de ambiente:
- Crie um arquivo `.env` na pasta `backend`.
- Você pode usar o arquivo `.env.example` como base: `cp .env.example .env` (se disponível) ou criar um novo com as seguintes chaves:

```env
# Provedor e Modelos
MODEL_PROVIDER=gemini
MODEL=gemini-1.5-flash
EMBEDDING_MODEL=text-embedding-004
EMBEDDING_DIM=768

# Chaves de API
GOOGLE_API_KEY=sua_chave_gemini_aqui
PRESENTON_API_KEY=sua_chave_presenton_aqui

# Configurações de Rede
APP_HOST=0.0.0.0
APP_PORT=8000
```

> **Nota:** A `GOOGLE_API_KEY` é necessária para o funcionamento da IA (Gemini) e a `PRESENTON_API_KEY` é necessária para a geração de slides.

Inicialize a base de dados do RAG (necessário apenas na primeira vez ou quando adicionar novos documentos):
```bash
poetry run generate
```

Inicie o servidor backend:
```bash
poetry run python main.py
```
O backend rodará em `http://localhost:8000`.

### 4. Configuração do Frontend
Em um novo terminal, na raiz do projeto, instale as dependências e inicie o site:
```bash
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:5173`.

---

## Como Testar o Projeto

O projeto possui uma suíte de testes automatizados organizada para garantir a qualidade e estabilidade das funcionalidades, seguindo os conceitos de testes unitários e de integração.

### **1. Frontend (Testes Unitários)**
Os testes do frontend estão localizados em `src/__tests__` e são focados em validar a lógica de negócio e serviços de forma isolada usando **Jest**.

- **Rodar todos os testes:**
  ```bash
  npm test
  ```
- **Rodar testes em modo detalhado:**
  ```bash
  npm run test:verbose
  ```

### **2. Backend (Unitários e Integração)**
O backend utiliza **Pytest** e está organizado em duas categorias principais na pasta `backend/tests`:

- **Testes Unitários (`tests/unit`):** Validam funções puras e serviços isolados, como os geradores de arquivos PDF/DOCX.
- **Testes de Integração (`tests/integration`):** Validam a comunicação entre componentes, como os endpoints da API (FastAPI) e o motor de busca semântica (RAG).

**Comandos para o Backend:**
1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  **Rodar todos os testes:**
    ```bash
    poetry run pytest
    ```
3.  **Rodar testes em modo detalhado:**
    ```bash
    poetry run pytest -v
    ```

**Observação:** Ambos os ambientes utilizam **dados mockados** (localizados nas pastas `mocks/`) para garantir que os testes sejam rápidos, reprodutíveis e não dependam de conexões externas ou custos de API durante o desenvolvimento.

---

## Implementação do RAG com Filtros

A solução utiliza **RAG (Retrieval-Augmented Generation)** para garantir que o material gerado pela IA seja fiel aos documentos oficiais. Um diferencial importante é o uso de **filtros por metadados** durante a recuperação:

- **Categorização Automática**: Ao processar os documentos (BNCC, CIEB, Leis), o sistema atribui metadados como `category` (`normativa`, `apoio`, `legal`, `pedagogica`).
- **Recuperação Contextual**:
  - Para **Planos de Aula**, o sistema filtra documentos das categorias `normativa` e `apoio` para garantir alinhamento curricular.
  - Para **Sugestões de Unidades**, o foco é em documentos `normativa` (BNCC).
  - Para **Atividades**, busca-se exemplos práticos em documentos de `apoio`.

Isso evita "alucinações" da IA e garante que a fundamentação legal e pedagógica citada nos planos de aula seja real e precisa.

---

## Documentos de Referência (Base do RAG)

Para garantir o alinhamento pedagógico e normativo, o sistema utiliza os seguintes documentos oficiais como base de conhecimento:

- **BNCC (Base Nacional Comum Curricular)**: Documento normativo que define o conjunto orgânico e progressivo de aprendizagens essenciais.
- **Currículo de Referência CIEB**: Referencial para o ensino de tecnologia e computação na Educação Básica.
- **Lei nº 14.533/2023**: Institui a Política Nacional de Educação Digital (PNED).
- **Resolução CNE/CEB nº 1/2022**: Institui as Normas sobre Computação na Educação Básica.
- **Parecer CNE/CEB nº 2/2022**: Fundamentação técnica e pedagógica para a inclusão da Computação no currículo.

---

## Participantes

Este projeto está sendo desenvolvido pelos estudantes:

- **Vanessa Pereira** — 4º módulo de Análise e Desenvolvimento de Sistemas (ADS)  
- **Matusalen Alves** — 4º módulo de Análise e Desenvolvimento de Sistemas (ADS)
