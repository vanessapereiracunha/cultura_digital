from app.engine.loaders.file import get_file_metadata

def test_get_file_metadata_bncc():
    """Testa se arquivos da BNCC são categorizados corretamente como normativa."""
    metadata = get_file_metadata("BNCC_Base_Nacional_Comum.pdf")
    assert metadata["category"] == "normativa"
    assert "Base Nacional Comum" in metadata["description"]

def test_get_file_metadata_cieb():
    """Testa se arquivos do CIEB são categorizados corretamente como apoio."""
    metadata = get_file_metadata("Curriculo_Referencia_CIEB.pdf")
    assert metadata["category"] == "apoio"
    assert "prático" in metadata["description"]

def test_get_file_metadata_legal():
    """Testa se leis e resoluções são categorizadas corretamente como legal."""
    metadata_lei = get_file_metadata("Lei_14533_Politica_Educacao_Digital.pdf")
    metadata_res = get_file_metadata("Resolucao_CNE_01_2022.pdf")
    
    assert metadata_lei["category"] == "legal"
    assert metadata_res["category"] == "legal"

def test_get_file_metadata_pedagogica():
    """Testa se pareceres são categorizados corretamente como pedagogica."""
    metadata = get_file_metadata("Parecer_CNE_Fundamentacao.pdf")
    assert metadata["category"] == "pedagogica"
    assert "pedagógica" in metadata["description"]

def test_get_file_metadata_geral():
    """Testa o fallback para arquivos genéricos."""
    metadata = get_file_metadata("documento_aleatorio.pdf")
    assert metadata["category"] == "geral"
