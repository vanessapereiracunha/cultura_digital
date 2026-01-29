from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
import logging
from app.engine.index import get_index
from llama_index.core.settings import Settings

from typing import List, Optional

slides_router = APIRouter()
logger = logging.getLogger("uvicorn")

class SlideRequest(BaseModel):
    topic: str
    slides_count: int = 5
    language: str = "pt-BR"
    serieAno: Optional[str] = None

import asyncio

@slides_router.post("/generate")
async def generate_slides(request: SlideRequest):
    api_key = os.getenv("PRESENTON_API_KEY")
    base_url = os.getenv("PRESENTON_BASE_URL", "https://api.presenton.ai")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="PRESENTON_API_KEY not configured")

    # 1. Generate Content using RAG/LLM
    try:
        index = get_index()
        context = ""
        if index:
            retriever = index.as_retriever(similarity_top_k=3)
            nodes = retriever.retrieve(request.topic)
            context = "\n\n".join([n.get_content() for n in nodes])
        
        # 1. Determine Tone and Style based on serieAno
        tone_instruction = ""
        is_young_audience = False
        if request.serieAno:
            young_grades = ["1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "1 ano", "2 ano", "3 ano", "4 ano", "5 ano", "Fundamental I"]
            if any(grade.lower() in request.serieAno.lower() for grade in young_grades):
                is_young_audience = True
                tone_instruction = (
                    "O público-alvo são crianças pequenas (Ensino Fundamental I). "
                    "Use uma linguagem muito simples, alegre, lúdica e divertida. "
                    "Inclua analogias criativas e emojis para tornar o conteúdo visualmente atraente e amigável."
                )
            else:
                tone_instruction = "O público-alvo são estudantes. Use uma linguagem clara, objetiva e educativa."

        prompt = (
            f"Crie um roteiro de conteúdo para uma apresentação de slides educacional sobre: '{request.topic}'.\n"
            f"Série/Ano: {request.serieAno if request.serieAno else 'Não especificado'}.\n"
            f"{tone_instruction}\n"
            f"A apresentação deve ter aproximadamente {request.slides_count} slides.\n"
            f"Use o seguinte contexto da BNCC/Currículo APENAS como base para o conteúdo pedagógico, mas NÃO inclua seções de metadados, alinhamento ou códigos da BNCC nos slides.\n"
            f"Contexto:\n{context}\n\n"
            "Gere APENAS o conteúdo dos slides (título e corpo). O foco deve ser puramente no assunto da aula.\n"
            "Não mencione 'BNCC', 'Competências' ou 'Habilidades' no texto final."
        )
        
        completion = Settings.llm.complete(prompt)
        generated_content = str(completion)
        
    except Exception as e:
        logger.error(f"Content generation failed: {str(e)}")
        generated_content = f"Apresentação sobre {request.topic}"

    # 2. Call Presenton API (Parallel for PPTX and PDF)
    base_url = base_url.rstrip("/")
    url = f"{base_url}/api/v1/ppt/presentation/generate"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    
    # Common payload fields
    base_payload = {
        "content": generated_content,
        "n_slides": request.slides_count,
        "language": request.language,
        "template": "general", # Reverted to 'general' as 'creative' is not a valid template ID
        "mood": "fun" if is_young_audience else "professional",
        "author": "Cultura Digital"
    }

    async def call_presenton(format_type):
        payload = {**base_payload, "export_as": format_type}
        async with httpx.AsyncClient() as client:
            logger.info(f"Calling Presenton API for {format_type}: {url}")
            response = await client.post(url, json=payload, headers=headers, timeout=120.0)
            if response.status_code != 200:
                logger.error(f"Presenton API Error ({format_type}): {response.text}")
                return None
            return response.json()

    try:
        # Run both requests in parallel
        results = await asyncio.gather(
            call_presenton("pptx"),
            call_presenton("pdf")
        )
        
        pptx_data, pdf_data = results
        
        if not pptx_data and not pdf_data:
             raise HTTPException(status_code=500, detail="Failed to generate slides in any format")

        # Helper to construct full URL
        def make_full_url(path):
            if not path:
                return None
            if path.startswith("http"):
                return path
            
            clean_base = base_url.strip().rstrip("/")
            if path.startswith("/"):
                return f"{clean_base}{path}"
            return f"{clean_base}/{path}"

        result = {
            "pptx_url": make_full_url(pptx_data.get('path')) if pptx_data else None,
            "pdf_url": make_full_url(pdf_data.get('path')) if pdf_data else None,
            "edit_url": make_full_url(pptx_data.get('edit_path')) if pptx_data else None,
            "presentation_id": pptx_data.get("presentation_id") if pptx_data else None
        }
        
        # Backward compatibility for existing UI
        result["download_url"] = result["pptx_url"]
        result["url"] = result["edit_url"]
        
        logger.info(f"Constructed Result: {result}")
        return result
            
    except Exception as e:
        logger.error(f"Failed to generate slides: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
