import { useState, type FormEvent } from "react";
import { FormField } from "../../../shared/components/FormField";
import { Button } from "../../../shared/components/Button";
import { OPCOES_SERIES, DISCIPLINAS_ESCOLARES } from "../constants";

type DisciplinaFormValues = {
  nome: string;
  serieAno: string;
  assunto?: string;
};

type DisciplinaFormProps = {
  initialValues?: DisciplinaFormValues;
  onSubmit: (values: DisciplinaFormValues) => void;
};

export function DisciplinaForm({ initialValues, onSubmit }: DisciplinaFormProps) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <FormField label="Série/Ano">
        <select
          value={serieAno}
          onChange={(event) => setSerieAno(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
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
        </select>
      </FormField>

      <FormField label="Disciplina">
        <select
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">Selecione uma disciplina</option>
          {DISCIPLINAS_ESCOLARES.map((disciplina) => (
            <option key={disciplina} value={disciplina}>
              {disciplina}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Assunto / Tópico Principal (Opcional)">
        <input
          value={assunto}
          onChange={(event) => setAssunto(event.target.value)}
          placeholder="Ex: Frações, Revolução Francesa..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </FormField>

      <div className="flex gap-2 justify-end">
        <Button type="submit">Confirmar criação</Button>
      </div>
    </form>
  );
}