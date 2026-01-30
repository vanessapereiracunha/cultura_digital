import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { ThemeProvider } from "../shared/contexts/ThemeContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
}