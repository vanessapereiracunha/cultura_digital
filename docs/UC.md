### Casos de Uso (UC)

**UC01 — Gerenciar disciplinas**
**Ator:** Professor  
**Objetivo:** Cadastrar, editar, listar e remover disciplinas.  
**Pré-condições:** Nenhuma.
**Vínculos em RF:** [RF01](RF.md#rf01--cadastro-e-gerenciamento-de-disciplinas)
**Vínculos em HU:** [HU01](HU.md#hu01--cadastrar-disciplina), [HU02](HU.md#hu02--editar-disciplina), [HU03](HU.md#hu03--remover-disciplina)
**Fluxo principal:**
1. O professor acessa a área de disciplinas.
2. Informa nome e série/ano.
3. O sistema salva e exibe a lista atualizada.

**Pós-condições:** Disciplina registrada/atualizada/removida.

**UC02 — Criar unidade manualmente**
**Ator:** Professor  
**Objetivo:** Criar uma unidade informando tema e disciplina.  
**Pré-condições:** Disciplina cadastrada.  
**Vínculos em RF:** [RF02](RF.md#rf02--criacao-manual-de-unidades-aulas)
**Vínculos em HU:** [HU04](HU.md#hu04--criar-unidade-manualmente)
**Fluxo principal:**
1. O professor seleciona a disciplina.
2. Informa tema e série/ano.
3. O sistema registra a unidade.

**Pós-condições:** Unidade criada.

**UC03 — Sugerir unidades via IA**
**Ator:** Professor  
**Objetivo:** Receber sugestões de unidades alinhadas à BNCC.  
**Pré-condições:** Disciplina cadastrada.  
**Vínculos em RF:** [RF03](RF.md#rf03--sugestao-automatica-de-unidades-via-ia)
**Vínculos em HU:** [HU05](HU.md#hu05--receber-sugestao-de-unidades)
**Fluxo principal:**
1. O professor solicita sugestões.
2. O sistema consulta a base BNCC/MEC via RAG.
3. A IA retorna sugestões de unidades.

**Pós-condições:** Unidades sugeridas disponíveis para seleção.

**UC04 — Gerar plano de aula**
**Ator:** Professor  
**Objetivo:** Gerar plano de aula para uma unidade.  
**Pré-condições:** Unidade criada ou sugerida.  
**Vínculos em RF:** [RF04](RF.md#rf04--geracao-automatica-de-plano-de-aula)
**Vínculos em HU:** [HU06](HU.md#hu06--gerar-plano-de-aula)
**Fluxo principal:**
1. O professor seleciona uma unidade.
2. O sistema gera o plano de aula via IA.
3. O professor visualiza e copia o plano.

**Pós-condições:** Plano de aula gerado.

**UC05 — Gerar atividade avaliativa**
**Ator:** Professor  
**Objetivo:** Gerar atividade avaliativa para uma unidade.  
**Pré-condições:** Unidade criada ou sugerida.  
**Vínculos em RF:** [RF05](RF.md#rf05--geracao-automatica-de-atividade-avaliativa)
**Vínculos em HU:** [HU07](HU.md#hu07--gerar-atividade-avaliativa)
**Fluxo principal:**
1. O professor seleciona uma unidade.
2. O sistema gera a atividade via IA.
3. O professor visualiza e copia a atividade.

**Pós-condições:** Atividade avaliativa gerada.

**UC06 (Opcional) — Gerar slides**
**Ator:** Professor  
**Objetivo:** Gerar slides de apoio para uma unidade.  
**Pré-condições:** Unidade criada ou sugerida.  
**Vínculos em RF:** [RF06](RF.md#rf06-opcional--geracao-de-slides-de-apoio)
**Vínculos em HU:** [HU08](HU.md#hu08-opcional--gerar-slides)
**Fluxo principal:**
1. O professor seleciona uma unidade.
2. O sistema gera slides via IA.
3. O professor visualiza e baixa os slides.

**Pós-condições:** Slides gerados.
