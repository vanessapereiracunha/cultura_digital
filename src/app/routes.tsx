import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { RootLayout } from "./layout";
import { DisciplinasPage } from "../features/disciplinas/ui";
import UnidadesPage from "../features/unidades/ui";
import MateriaisPage from "../features/materiais/ui";
import { buscarDisciplina } from "../features/disciplinas/services";
import { buscarUnidade } from "../features/unidades/services";
import type { Unidade } from "../features/unidades/models";

function DisciplinasRoute() {
  const navigate = useNavigate();
  
  return (
    <DisciplinasPage
      onSelecionarDisciplina={(d) => navigate(`/disciplina/${d.id}/unidades`)}
    />
  );
}

function UnidadesRoute() {
  const { disciplinaId } = useParams();
  const navigate = useNavigate();
  
  const disciplina = disciplinaId ? buscarDisciplina(disciplinaId) : null;
  
  if (!disciplina) {
    return <Navigate to="/" replace />;
  }

  return (
    <UnidadesPage
      disciplina={disciplina}
      onSelecionarUnidade={(u: Unidade) => navigate(`/disciplina/${disciplina.id}/unidade/${u.id}/materiais`)}
      onVoltar={() => navigate("/")}
    />
  );
}

function MateriaisRoute() {
  const { disciplinaId, unidadeId } = useParams();
  const navigate = useNavigate();
  
  const disciplina = disciplinaId ? buscarDisciplina(disciplinaId) : null;
  const unidade = unidadeId ? buscarUnidade(unidadeId) : null;
  
  if (!disciplina || !unidade) {
    return <Navigate to="/" replace />;
  }

  return (
    <MateriaisPage
      disciplina={disciplina}
      unidade={unidade}
      onVoltar={() => navigate(`/disciplina/${disciplina.id}/unidades`)}
    />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<DisciplinasRoute />} />
        <Route path="/disciplina/:disciplinaId/unidades" element={<UnidadesRoute />} />
        <Route path="/disciplina/:disciplinaId/unidade/:unidadeId/materiais" element={<MateriaisRoute />} />
      </Route>
    </Routes>
  );
}
