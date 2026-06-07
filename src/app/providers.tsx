"use client";

import { LangProvider } from "../components/LangContext";
import { ThemeProvider } from "../components/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  );
}
