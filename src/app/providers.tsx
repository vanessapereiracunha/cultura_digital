import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      {/* Aqui poderíamos adicionar outros providers: ThemeProvider, AuthProvider, etc. */}
      {children}
    </BrowserRouter>
  );
}
