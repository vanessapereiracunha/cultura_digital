from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import logging
from app.engine.index import get_index
from llama_index.core.settings import Settings
from app.api.services.lesson_plan_generator import LessonPlanGenerator

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
    conteudo: Dict[str, object]

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
                f"disciplina {request.disciplina}, unidade {request.unidade}. "
                f"Incluir diretrizes de Cultura Digital/Computação (CNE/CEB, Resolução 01/2022) e Política Nacional de Educação Digital."
            )
            try:
                nodes = retriever.retrieve(query)
                context_text = "\n\n".join([n.get_content() for n in nodes])
            except Exception as e:
                logger.warning(f"Falha ao recuperar contexto (embeddings indisponíveis): {e}")
                context_text = ""

        prompt = (
            "Você é um coordenador pedagógico experiente, especialista em BNCC e nas Normas sobre Computação na Educação Básica (Resolução CNE/CEB nº 1/2022).\n"
            "Crie um Plano de Aula detalhado e estruturado para a seguinte unidade:\n\n"
            f'Disciplina: "{request.disciplina}"\n'
            f'Série/Ano: "{request.serieAno}"\n'
            f'Unidade: "{request.unidade}"\n'
            f'Descrição: "{request.descricao}"\n\n'
            "BASE NORMATIVA OBRIGATÓRIA:\n"
            "1. BNCC (Base Nacional Comum Curricular): Competências gerais e habilidades específicas da disciplina.\n"
            "2. RESOLUÇÃO CNE/CEB Nº 1/2022: Normas sobre Computação na Educação Básica (Eixos: Pensamento Computacional, Mundo Digital e Cultura Digital).\n"
            "3. LEI Nº 14.533/2023: Política Nacional de Educação Digital.\n\n"
            "Use o seguinte contexto recuperado (que contém trechos das normas citadas) como base técnica:\n"
            f"{context_text}\n\n"
            "REGRAS DE SAÍDA:\n"
            "Responda EXATAMENTE com um JSON válido no seguinte formato:\n"
            "{\n"
            '  "titulo": "Título da Aula",\n'
            '  "duracao": "Duração prevista (ex: 50 min)",\n'
            '  "serieAno": "Série/Ano",\n'
            '  "objetivos": ["objetivo 1", "objetivo 2"],\n'
            '  "conteudoProgramatico": ["tópico 1", "tópico 2"],\n'
            '  "estrategiasEnsino": ["metodologia ou passo a passo 1", "metodologia ou passo a passo 2"],\n'
            '  "bncc": ["EF05HI01 - descrição articulada com a Resolução CNE/CEB nº 1/2022", "Eixo: Pensamento Computacional - descrição conforme norma"],\n'
            '  "avaliacao": "Descrição textual de como a avaliação será realizada",\n'
            '  "recursos": ["recurso 1", "recurso 2"],\n'
            '  "referencias": ["referência bibliográfica ou link 1", "referência 2"]\n'
            "}\n\n"
            "INSTRUÇÕES:\n"
            "- No campo 'bncc', você DEVE citar as habilidades da BNCC e as competências da Resolução CNE/CEB nº 1/2022 de forma integrada/misturada, mostrando como a Computação apoia a habilidade da disciplina.\n"
            "- Exemplo de item em 'bncc': 'EF05MA01 articulado com Eixo Mundo Digital (Res. 01/2022): [Descrição da integração]'.\n"
            "- O campo 'referencias' deve citar obrigatoriamente a BNCC e a Resolução CNE/CEB nº 1/2022.\n"
            "- Mantenha linguagem objetiva e estritamente alinhada às normas pedagógicas brasileiras.\n"
            "- Não inclua markdown ```json ... ```; responda apenas com o JSON puro."
        )

        response = Settings.llm.complete(prompt)
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "")
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "")
        data = json.loads(response_text)
        return LessonPlanResponse(conteudo=data)

    except Exception as e:
        logger.error(f"Error generating lesson plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class LessonPlanPdfRequest(BaseModel):
    data: Dict[str, object]

class LessonPlanPdfResponse(BaseModel):
    filename: str
    download_url: str

@unit_router.post("/lesson-plan/pdf", response_model=LessonPlanPdfResponse)
async def generate_lesson_plan_pdf(request: LessonPlanPdfRequest):
    try:
        filename = LessonPlanGenerator.generate_pdf(request.data or {})
        return LessonPlanPdfResponse(
            filename=filename,
            download_url=f"/api/files/output/generated_plans/{filename}",
        )
    except Exception as e:
        logger.error(f"Error generating lesson plan PDF: {str(e)}")
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
            try:
                nodes = retriever.retrieve(query)
                context_text = "\n\n".join([n.get_content() for n in nodes])
            except Exception as e:
                logger.warning(f"Falha ao recuperar contexto (embeddings indisponíveis): {e}")
                context_text = ""

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
