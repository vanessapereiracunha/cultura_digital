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

## Participantes

Este projeto está sendo desenvolvido pelos estudantes:

- **Vanessa Pereira** — 4º módulo de Análise e Desenvolvimento de Sistemas (ADS)  
- **Matusalen Alves** — 4º módulo de Análise e Desenvolvimento de Sistemas (ADS)