import { ReactNode } from "react";

// Provider component types
export interface QueryProviderProps {
  children: ReactNode;
}

export interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}