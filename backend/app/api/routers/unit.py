from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
import logging
from app.engine.index import get_index
from llama_index.core.settings import Settings

unit_router = APIRouter()
logger = logging.getLogger("uvicorn")

class UnitSuggestionRequest(BaseModel):
    disciplina: str
    serieAno: str

class UnitSuggestion(BaseModel):
    nome: str
    descricao: str

class UnitSuggestionResponse(BaseModel):
    sugestoes: List[UnitSuggestion]

class LessonPlanRequest(BaseModel):
    disciplina: str
    serieAno: str
    unidade: str
    descricao: str

class LessonPlanResponse(BaseModel):
    conteudo: str

from llama_index.core.vector_stores import MetadataFilter, MetadataFilters

@unit_router.post("/lesson-plan", response_model=LessonPlanResponse)
async def generate_lesson_plan(request: LessonPlanRequest):
    try:
        index = get_index()
        
        # Filtros: Priorizar BNCC (normativa), CIEB (apoio), Leis (legal) e Pareceres (pedagogica)
        filters = MetadataFilters(
            filters=[
                MetadataFilter(key="category", value="normativa"),  # BNCC
                MetadataFilter(key="category", value="apoio"),      # CIEB
                MetadataFilter(key="category", value="legal"),      # Leis e Resoluções
                MetadataFilter(key="category", value="pedagogica"), # Pareceres (Conceitos)
            ],
            condition="or"
        )

        retriever = index.as_retriever(
            similarity_top_k=5, 
            filters=filters
        ) if index else None

        context_text = ""
        if retriever:
            query = (
                f"Habilidades e competências BNCC para {request.serieAno}, "
                f"disciplina {request.disciplina}, unidade {request.unidade}"
            )
            nodes = retriever.retrieve(query)
            context_text = "\n\n".join([n.get_content() for n in nodes])

        prompt = (
            "Você é um coordenador pedagógico experiente.\n"
            "Crie um Plano de Aula detalhado e estruturado para a seguinte unidade:\n\n"
            f'Disciplina: "{request.disciplina}"\n'
            f'Série/Ano: "{request.serieAno}"\n'
            f'Unidade: "{request.unidade}"\n'
            f'Descrição: "{request.descricao}"\n\n'
            "Use o seguinte contexto da BNCC como base:\n"
            f"{context_text}\n\n"
            "O plano de aula deve conter:\n"
            "1. Título da Aula\n"
            "2. Objetivos de Aprendizagem (alinhados à BNCC)\n"
            "3. Habilidades BNCC trabalhadas (códigos e descrições)\n"
            "4. Justificativa Legal/Social (baseada na Lei de Educação Digital, se aplicável)\n"
            "5. Conteúdo Programático\n"
            "6. Estratégias Metodológicas (passo a passo da aula)\n"
            "7. Recursos Didáticos necessários\n"
            "8. Avaliação (como verificar o aprendizado)\n\n"
            "Responda em formato Markdown bem formatado."
        )

        response = Settings.llm.complete(prompt)
        return LessonPlanResponse(conteudo=response.text)

    except Exception as e:
        logger.error(f"Error generating lesson plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@unit_router.post("/suggest", response_model=UnitSuggestionResponse)
async def suggest_units(request: UnitSuggestionRequest):
    try:
        index = get_index()
        
        # Filtros: Focar em documentos de currículo (BNCC/CIEB) para sugestão de unidades
        filters = MetadataFilters(
            filters=[
                MetadataFilter(key="category", value="normativa"),  # BNCC
                MetadataFilter(key="category", value="apoio"),      # CIEB
            ],
            condition="or"
        )

        if index is None:
             logger.warning("Index not initialized, using LLM knowledge only")
             retriever = None
        else:
            retriever = index.as_retriever(
                similarity_top_k=5,
                filters=filters
            )

        context_text = ""
        if retriever:
            query = (
                f"Quais são as unidades temáticas da BNCC para "
                f"{request.serieAno}, disciplina {request.disciplina}?"
            )
            nodes = retriever.retrieve(query)
            context_text = "\n\n".join([n.get_content() for n in nodes])

        prompt = (
            "Você é um especialista em currículo escolar alinhado à BNCC.\n"
            "Sua tarefa é sugerir EXATAMENTE 4 unidades de ensino lógicas, sequenciais e distintas para cobrir todo o ano letivo.\n\n"
            f'Série/Ano: "{request.serieAno}"\n'
            f'Disciplina: "{request.disciplina}"\n\n'
            "Contexto da BNCC (se houver):\n"
            f"{context_text}\n\n"
            "REGRAS OBRIGATÓRIAS:\n"
            "1. Gere exatamente 4 unidades (Bimestre 1, 2, 3 e 4).\n"
            "2. Os nomes das unidades devem ser TEMÁTICOS e DESCRITIVOS (ex: 'Introdução à Lógica', 'Cidadania Digital'), NÃO use apenas 'Unidade 1'.\n"
            "3. As unidades devem seguir uma progressão lógica de dificuldade.\n"
            "4. Não repita nomes ou temas.\n\n"
            "Responda EXATAMENTE com um JSON válido no seguinte formato:\n"
            "{\n"
            '  "sugestoes": [\n'
            '    { "nome": "Título Temático da Unidade 1", "descricao": "Descrição clara dos objetivos e temas abordados." },\n'
            '    { "nome": "Título Temático da Unidade 2", "descricao": "Descrição clara dos objetivos e temas abordados." },\n'
            '    { "nome": "Título Temático da Unidade 3", "descricao": "Descrição clara dos objetivos e temas abordados." },\n'
            '    { "nome": "Título Temático da Unidade 4", "descricao": "Descrição clara dos objetivos e temas abordados." }\n'
            "  ]\n"
            "}\n\n"
            "Não inclua markdown ```json ... ```; responda apenas com o JSON puro."
        )
        
        response = Settings.llm.complete(prompt)
        response_text = response.text.strip()
        
        # Clean up markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "")
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "")
            
        data = json.loads(response_text)
        return data

    except Exception as e:
        logger.error(f"Error generating unit suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
