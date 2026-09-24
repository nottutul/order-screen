"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: "success" | "error" | "info"
}

interface ToastContextType {
  toasts: ToastMessage[]
  toast: (options: Omit<ToastMessage, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ title, description, type = "info" }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastMessage = { id, title, description, type }
      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        dismiss(id)
      }, 3500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast Notification Container positioned nicely on mobile & desktop */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 w-full p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200",
              t.type === "success" &&
                "bg-emerald-950/90 text-emerald-100 border-emerald-700/60 dark:bg-emerald-900/90",
              t.type === "error" &&
                "bg-rose-950/90 text-rose-100 border-rose-700/60 dark:bg-rose-900/90",
              t.type === "info" &&
                "bg-zinc-900/95 text-zinc-100 border-zinc-700/60"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="size-4 text-emerald-400" />}
              {t.type === "error" && <AlertCircle className="size-4 text-rose-400" />}
              {t.type === "info" && <Info className="size-4 text-sky-400" />}
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-zinc-300 dark:text-zinc-400 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-zinc-400 hover:text-white shrink-0 p-0.5 rounded-md"
              aria-label="Dismiss toast"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
