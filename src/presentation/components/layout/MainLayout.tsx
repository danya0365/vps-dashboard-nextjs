"use client";

import { ReactNode } from "react";
import { MainFooter } from "./MainFooter";
import { MainHeader } from "./MainHeader";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - Full screen layout
 * Features:
 * - Fixed header at top
 * - Scrollable content area with hidden scrollbar
 * - Fixed footer at bottom
 * - No page scroll (web app feel)
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orb - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl" />
        {/* Gradient orb - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <MainHeader />

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <MainFooter />
    </div>
  );
}
