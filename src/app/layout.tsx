import { Outlet, Link, useLocation } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-900">Cultura Digital</h1>
              <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Professor Assistente</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="hidden sm:flex items-center gap-1">
              <GraduationCap size={16} />
              <span>Hackathon IFPI 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb simples (opcional, pode ser melhorado depois) */}
        {location.pathname !== "/" && (
          <div className="mb-6">
            <Link 
              to="/" 
              className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              ← Voltar para o início
            </Link>
          </div>
        )}
        
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Desenvolvido por <span className="font-semibold text-slate-900">Vanessa Pereira</span> e <span className="font-semibold text-slate-900">Matusalen Alves</span>
          </p>
          <div className="max-w-md mx-auto bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Nota sobre IA:</strong> Este sistema utiliza modelos de linguagem (Llama) para gerar sugestões pedagógicas baseadas na BNCC. 
              O professor deve sempre revisar o conteúdo antes de aplicá-lo em sala de aula.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
