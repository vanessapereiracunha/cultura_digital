### Planejamento de Sprints — Cultura Digital

Aplicação web single-user para geração de materiais didáticos de Cultura Digital alinhados à BNCC.  

#### Documentação Relacionada

- [Requisitos Funcionais (RF)](./RF.md)
- [Histórias de Usuário (HU)](./HU.md)
- [Casos de Uso (UC)](./UC.md)
- [Arquitetura](./ARQUITETURA.md)

#### Visão Geral Estratégica

O planejamento em sprints prioriza entregas incrementais e funcionais. O objetivo é alcançar um MVP consistente para a apresentação do hackathon, mantendo o alinhamento ao edital e à BNCC.

#### Cronograma Executivo

| Sprint | Duração | Foco Principal | Valor Entregue | Criticidade |
|--------|---------|---|---|---|
| 1 |  dias | Base + CRUD | Disciplinas e Unidades manuais | Essencial |
| 2 |  dias | IA + RAG | Sugestões e geração de conteúdo | Essencial |
| 3 |  dias | UX + Entrega | Polimento, README e deploy | Essencial |

**Duração Total Estimada:** 7–11 dias  
**MVP Funcional:** Sprints 1–2

#### SPRINT 1 — Base e Estrutura

**Duração:** dias  
**Objetivo:** Implementar o núcleo funcional sem IA

### Histórias de Usuário Relacionadas
- [ ] [HU01](./HU.md#hu01--cadastrar-disciplina) — Cadastrar disciplina
- [ ] [HU02](./HU.md#hu02--editar-disciplina) — Editar disciplina
- [ ] [HU03](./HU.md#hu03--remover-disciplina) — Remover disciplina
- [ ] [HU04](./HU.md#hu04--criar-unidade-manualmente) — Criar unidade manualmente

### Entregas
- [ ] CRUD de disciplinas (RF01)
- [ ] Criação manual de unidades (RF02)
- [ ] UI base com fluxo mínimo (disciplinas → unidades)
- [ ] Persistência local simples (localStorage/IndexedDB)
- [ ] Estrutura inicial de dados (disciplinas, unidades, materiais)
- [ ] Validações de formulário e mensagens de erro

### Critérios de Aceitação
- [ ] Professor cadastra, edita e remove disciplinas
- [ ] Professor cria unidade manualmente vinculada à disciplina
- [ ] Navegação básica funcionando sem erros

#### SPRINT 2 — IA + RAG (Llama)

**Duração:** dias  
**Objetivo:** Implementar IA com RAG e geração de materiais

### Histórias de Usuário Relacionadas
- [ ] [HU05](./HU.md#hu05--receber-sugestao-de-unidades) — Sugestão de unidades via IA
- [ ] [HU06](./HU.md#hu06--gerar-plano-de-aula) — Gerar plano de aula
- [ ] [HU07](./HU.md#hu07--gerar-atividade-avaliativa) — Gerar atividade avaliativa
- [ ] [HU08](./HU.md#hu08-opcional--gerar-slides) — Gerar slides (opcional)

### Entregas
- [ ] Sugestão automática de unidades (RF03)
- [ ] Geração de plano de aula (RF04)
- [ ] Geração de atividade avaliativa (RF05)
- [ ] Slides de apoio (RF06 opcional)
- [ ] Pipeline RAG com Llama (retrieval + geração)
- [ ] Indexação de BNCC/MEC (coleção, chunks, embeddings)
- [ ] Prompt base centralizado e versionado
- [ ] Tratamento de erro e fallback na geração

### Critérios de Aceitação
- [ ] IA sugere unidades alinhadas à BNCC
- [ ] Plano de aula gerado para unidade
- [ ] Atividade avaliativa gerada para unidade

#### SPRINT 3 — UX, Documentação e Entrega

**Duração:** dias  
**Objetivo:** Refinar experiência e preparar apresentação

### Entregas
- [ ] Ajustes de UX/IHC (linguagem e feedbacks)
- [ ] Revisão de textos e consistência visual
- [ ] README com papel da IA
- [ ] Documentação final (RF/HU/UC/Arquitetura)
- [ ] Deploy temporário para avaliação
- [ ] Roteiro de apresentação (6 min)

### Critérios de Aceitação
- [ ] Interface clara para professores
- [ ] Documentação alinhada ao edital
- [ ] Sistema pronto para demo
