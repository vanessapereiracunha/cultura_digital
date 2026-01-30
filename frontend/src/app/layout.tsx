import { Outlet, Link } from "react-router-dom";
import { Alert } from "../shared/components/Alert";
import { BookOpen, Sun, Moon } from "lucide-react";
import { Button } from "../shared/components/Button";
import { useTheme } from "../shared/contexts/ThemeContext";

export function RootLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/90 text-slate-900 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 gap-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-slate-900 transition hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">HACKATON IFPI</p>
              <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Cultura Digital</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              icon={theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            >
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/70 bg-slate-50/90 py-10 dark:border-white/5 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 text-center text-slate-700 dark:text-slate-300 sm:px-6">
          <p className="text-sm">Desenvolvido por <strong className="text-slate-900 dark:text-white">Vanessa Pereira</strong> e <strong className="text-slate-900 dark:text-white">Matusalen Alves</strong></p>
          <Alert type="primary" className="mx-auto max-w-3xl bg-white/5">
            <p className="text-sm text-slate-800 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-white">Nota sobre IA:</strong> este sistema utiliza modelos de linguagem (Llama) para gerar sugestões pedagógicas baseadas na BNCC. O professor deve sempre revisar o conteúdo antes de aplicá-lo em sala de aula.
            </p>
          </Alert>
        </div>
      </footer>
    </div>
  );
}
