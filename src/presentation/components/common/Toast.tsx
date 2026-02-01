"use client";

import { animated, useTransition } from "@react-spring/web";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

/**
 * ToastProvider - Context provider for toast notifications
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const transitions = useTransition(toasts, {
    keys: (t) => t.id,
    from: { opacity: 0, transform: "translateX(100%)", height: 0 },
    enter: { opacity: 1, transform: "translateX(0%)", height: 80 },
    leave: { opacity: 0, transform: "translateX(100%)", height: 0 },
    config: { tension: 300, friction: 25 },
  });

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {transitions((style, toast) => (
        <animated.div style={style} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={() => onRemove(toast.id)} />
        </animated.div>
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const colors = {
    success: "border-green-500 bg-green-50 dark:bg-green-900/20",
    error: "border-red-500 bg-red-50 dark:bg-red-900/20",
    warning: "border-amber-500 bg-amber-50 dark:bg-amber-900/20",
    info: "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border-l-4 backdrop-blur-xl shadow-xl ${colors[toast.type]}`}
    >
      <span className="text-xl">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 dark:text-white text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
