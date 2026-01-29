import { useState, type FormEvent } from "react";
import { OPCOES_SERIES, DISCIPLINAS_ESCOLARES } from "../constants";
import { Input, Select } from "../../../shared/components/FormFields";
import { Button } from "../../../shared/components/Button";

type DisciplinaFormValues = {
  nome: string;
  serieAno: string;
  assunto?: string;
};

type DisciplinaFormProps = {
  initialValues?: DisciplinaFormValues;
  onSubmit: (values: DisciplinaFormValues) => void;
  onCancel: () => void;
};

export function DisciplinaForm({ initialValues, onSubmit, onCancel }: DisciplinaFormProps) {
  const [nome, setNome] = useState(initialValues?.nome ?? "");
  const [serieAno, setSerieAno] = useState(initialValues?.serieAno ?? "");
  const [assunto, setAssunto] = useState(initialValues?.assunto ?? "");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim() || !serieAno.trim()) {
      return;
    }
    onSubmit({ 
      nome: nome.trim(), 
      serieAno: serieAno.trim(),
      assunto: assunto.trim() || undefined
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Ano letivo"
        value={serieAno}
        onChange={(event) => setSerieAno(event.target.value)}
      >
        <option value="">Selecione uma série</option>
        {OPCOES_SERIES.map((grupo) => (
          <optgroup key={grupo.label} label={grupo.label}>
            {grupo.options.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>

      <Select
        label="Disciplina"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      >
        <option value="">Selecione uma disciplina</option>
        {DISCIPLINAS_ESCOLARES.map((disciplina) => (
          <option key={disciplina} value={disciplina}>
            {disciplina}
          </option>
        ))}
      </Select>

      <Input
        label="Assunto (Opcional)"
        value={assunto}
        onChange={(event) => setAssunto(event.target.value)}
        placeholder=" "
      />

      <nav className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </nav>
    </form>
  );
}