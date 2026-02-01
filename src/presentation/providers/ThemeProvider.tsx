"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { ToastProvider } from "../components/common/Toast";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders - All client-side providers wrapped together
 * Includes: Theme, Toast notifications
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </NextThemesProvider>
  );
}

// Keep the old export for backward compatibility
export { AppProviders as ThemeProvider };
