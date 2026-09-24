"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  variant?: "bottom-sheet" | "center"
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "bottom-sheet",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden border border-border bg-card shadow-2xl",
          variant === "bottom-sheet"
            ? "fixed top-auto bottom-0 sm:top-[50%] sm:bottom-auto translate-y-0 sm:translate-y-[-50%] rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col data-[state=open]:slide-in-from-bottom sm:data-[state=open]:slide-in-from-top-[48%]"
            : "rounded-2xl max-h-[85vh]"
        )}
      >
        {/* Mobile drag handle indicator */}
        <div className="flex justify-center pt-3 pb-0.5 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Radix Dialog Header */}
        <DialogHeader className="p-5 pb-2 text-left">
          <DialogTitle className="text-base font-bold text-foreground sm:text-lg">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-muted-foreground sm:text-sm mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-5 py-2 pb-6 max-h-[calc(85vh-100px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
