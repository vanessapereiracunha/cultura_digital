import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_read_root_redirects():
    """Verifica se a raiz redireciona ou retorna 404/200 dependendo da config"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code in [200, 404]

@pytest.mark.asyncio
async def test_activity_generate_validation():
    """Verifica se o endpoint de atividades valida o corpo da requisição"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/activity/generate", json={})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_units_lesson_plan_validation():
    """Verifica se o endpoint de plano de aula valida o corpo da requisição"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/units/lesson-plan", json={})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_units_suggest_validation():
    """Verifica se o endpoint de sugestão de unidades valida o corpo da requisição"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/units/suggest", json={})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_slides_generate_validation():
    """Verifica se o endpoint de slides valida o corpo da requisição"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/slides/generate", json={})
    assert response.status_code == 422
