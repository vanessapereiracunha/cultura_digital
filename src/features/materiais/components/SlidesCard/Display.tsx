type SlidesDisplayProps = {
  unidadeNome: string;
};

export function SlidesDisplay({ unidadeNome }: SlidesDisplayProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-white/5">
      <p className="text-sm text-slate-700 dark:text-slate-200">
        Apresentação gerada com sucesso para a unidade <strong>{unidadeNome}</strong>.
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Use os botões acima para visualizar online, baixar em PowerPoint ou PDF.
      </p>
    </div>
  );
}
