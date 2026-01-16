### Arquitetura (Visão Geral)

#### Objetivo
Descrever uma arquitetura simples e consistente para um sistema web single-user que gera materiais didáticos para professores de diferentes áreas alinhados à BNCC usando RAG com Llama.

#### Componentes
- **UI Web**: telas para disciplinas, unidades e geração de materiais.
- **Camada de Serviços**: orquestra chamadas de IA e validações.
- **Camada RAG (Llama)**: recuperação de trechos BNCC/MEC + geração.
- **Base de Conhecimento**: documentos oficiais (BNCC/MEC) indexados.
- **Armazenamento Local**: cache simples de disciplinas/unidades (opcional).

#### Fluxo principal
1. Professor cria ou seleciona disciplina.
2. Professor cria unidade manualmente ou solicita sugestão via IA.
3. Sistema recupera trechos BNCC/MEC relevantes (RAG).
4. Llama gera plano de aula e atividade avaliativa.
5. Resultado é exibido na UI e pode ser copiado.

#### Decisões
- **Single-user**: sem autenticação e sem multiusuário.
- **RAG obrigatório**: garantir alinhamento com BNCC/MEC.
- **Llama**: modelo principal de geração.
- **Simplicidade**: evitar complexidade excessiva para o hackathon.
