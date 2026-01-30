import os
import pytest
from app.api.services.lesson_plan_generator import LessonPlanGenerator, OUTPUT_DIR
from tests.mocks.lesson_plan_mock import MOCK_LESSON_PLAN

def test_generate_lesson_plan_pdf():
    """Testa a geração de PDF com dados válidos"""
    filename = LessonPlanGenerator.generate_pdf(MOCK_LESSON_PLAN)
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    assert filename.startswith("plano_")
    assert filename.endswith(".pdf")
    assert os.path.exists(filepath)
    
    # Limpeza após o teste
    if os.path.exists(filepath):
        os.remove(filepath)

def test_generate_pdf_empty_data():
    """Testa se o gerador lida com dados vazios sem quebrar."""
    filename = LessonPlanGenerator.generate_pdf({})
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    assert os.path.exists(filepath)
    os.remove(filepath)
