from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import logging
from app.engine.index import get_index
from llama_index.core.settings import Settings
from app.api.services.activity_generator import ActivityGenerator, OUTPUT_DIR

activity_router = APIRouter()
logger = logging.getLogger("uvicorn")

class ActivityRequest(BaseModel):
    disciplina: str
    assunto: str
    nivel: str
    format: str = "pdf"

class ActivityResponse(BaseModel):
    download_url: str
    filename: str
    content: Optional[dict] = None

from llama_index.core.vector_stores import MetadataFilter, MetadataFilters

@activity_router.post("/generate", response_model=ActivityResponse)
async def generate_activity(request: ActivityRequest):
    try:
        index = get_index()
        if index is None:
             # Fallback: proceed without retrieval if necessary, or just warn
             # raise HTTPException(status_code=500, detail="Index not initialized")
             logger.warning("Index not initialized for activity generation")
             retriever = None
             context_text = ""
        else:
            # Filtros: Queremos Atividades (CIEB) e Alinhamento (BNCC)
            filters = MetadataFilters(
                filters=[
                    MetadataFilter(key="category", value="normativa"), # BNCC
                    MetadataFilter(key="category", value="apoio"),     # CIEB
                ],
                condition="or"
            )

            retriever = index.as_retriever(
                similarity_top_k=5,
                filters=filters
            )
            query = (
                f"Habilidades e competências da BNCC para "
                f"{request.nivel}, disciplina {request.disciplina}, "
                f"sobre o tema {request.assunto}."
            )
            nodes = retriever.retrieve(query)
            context_text = "\n\n".join([n.get_content() for n in nodes])

        prompt = (
            f"Você é um professor de {request.disciplina} experiente no Ensino Básico.\n"
            f"Sua tarefa é criar uma Atividade Avaliativa sobre '{request.assunto}' para alunos do {request.nivel}.\n\n"
            "DIRETRIZES DE QUALIDADE (IMPORTANTE):\n"
            "1. ADEQUAÇÃO AO NÍVEL: A linguagem e a dificuldade devem ser ACESSÍVEIS para a série solicitada. Evite termos acadêmicos ou questões complexas demais.\n"
            "2. FOCO NA DISCIPLINA: A atividade deve ser sobre a matéria solicitada. Se for Matemática, foque em Matemática. Se for História, foque em História. NÃO force temas de tecnologia se não fizer sentido.\n"
            "3. SEM ALUCINAÇÕES: Não invente nomes de empresas, escolas ou softwares fictícios (ex: 'Escola ConectaTech', 'App MathLife'). Use contextos reais ou genéricos.\n"
            "4. TEXTO DE APOIO OPCIONAL: Se ALGUMA questão usar a expressão 'Segundo o texto' (ou variações de maiúsculas/minúsculas), você DEVE preencher o campo 'content' com um texto curto de apoio (máx. 2 parágrafos). Esse texto será exibido ANTES das questões e deve conter, de forma explícita, as informações necessárias para responder às perguntas que começam com 'Segundo o texto'.\n"
            "5. Se NENHUMA questão usar a expressão 'Segundo o texto', o campo 'content' deve ser uma string vazia (\"\") e as questões não podem depender de um texto de apoio externo.\n"
            "6. BNCC E CIEB COMO BASE: Use o contexto abaixo (que pode conter normas da BNCC e exemplos do CIEB) para alinhar as habilidades e inspirar as questões.\n\n"
            "Contexto (BNCC/CIEB):\n"
            f"{context_text}\n\n"
            "Estrutura da Atividade:\n"
            "1. Texto de Apoio (campo 'content'): Curto, direto e fácil de ler (máx. 2 parágrafos). Só deve ser preenchido se houver questões com 'Segundo o texto'.\n"
            "2. Questões: 5 questões de múltipla escolha. Devem ser claras e objetivas.\n"
            "3. Alternativas: Simples e diretas.\n\n"
            "A saída deve ser EXATAMENTE um JSON válido com a seguinte estrutura:\n"
            "{\n"
            '  "title": "Título Criativo da Atividade",\n'
            '  "objective": "Objetivo pedagógico da atividade (em 1 parágrafo)",\n'
            '  "bncc_skills": [\n'
            '    "Código(s) e descrição(ões) da(s) habilidade(s) da BNCC usadas"\n'
            "  ],\n"
            '  "content": "Um texto de apoio curto e direto OU string vazia se nenhuma questão usar \\"Segundo o texto\\".",\n'
            '  "questions": [\n'
            "    {\n"
            '      "enunciado": "Enunciado da questão 1 (pode começar com \\"Segundo o texto\\" se fizer sentido)",\n'
            '      "alternativas": [\n'
            '        "A) alternativa A",\n'
            '        "B) alternativa B",\n'
            '        "C) alternativa C",\n'
            '        "D) alternativa D"\n'
            "      ],\n"
            '      "correta": "A"\n'
            "    },\n"
            "    {\n"
            '      "enunciado": "Enunciado da questão 2",\n'
            '      "alternativas": [\n'
            '        "A) alternativa A",\n'
            '        "B) alternativa B",\n'
            '        "C) alternativa C",\n'
            '        "D) alternativa D"\n'
            "      ],\n"
            '      "correta": "C"\n'
            "    }\n"
            "  ]\n"
            "}\n\n"
            "Não inclua markdown ```json ... ```; responda apenas com o JSON puro.\n"
        )
        
        response = Settings.llm.complete(prompt)
        response_text = response.text.strip()
        
        # Clean up markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "")
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "")
            
        activity_data = json.loads(response_text)
        
        # 3. Generate File
        if request.format.lower() == "docx":
            filename = ActivityGenerator.generate_docx(activity_data)
        else:
            filename = ActivityGenerator.generate_pdf(activity_data)
            
        
        return ActivityResponse(
            download_url=f"/api/files/output/generated_activities/{filename}",
            filename=filename,
            content=activity_data
        )
        
    except Exception as e:
        logger.exception("Error generating activity")
        raise HTTPException(status_code=500, detail=str(e))
