"use client"

import * as React from "react"
import { AlertCircle, RefreshCw, Search, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function LoadingState() {
  return (
    <div className="space-y-4 p-4 pb-20 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      {/* Hero Card Skeleton */}
      <Card className="p-4 sm:p-5 space-y-4 border border-border/80">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="size-11 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </Card>

      {/* Map Skeleton */}
      <Skeleton className="h-44 w-full rounded-2xl" />

      {/* Timeline Skeleton */}
      <Card className="p-5 space-y-4">
        <Skeleton className="h-5 w-36" />
        <div className="space-y-6 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="size-7 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Items Skeleton */}
      <Card className="p-5 space-y-3">
        <Skeleton className="h-5 w-44" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="size-14 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </Card>
    </div>
  )
}

interface ErrorStateProps {
  onRetry: () => void
  onResetOrder: () => void
}

export function ErrorState({ onRetry, onResetOrder }: ErrorStateProps) {
  const [searchVal, setSearchVal] = React.useState("")

  return (
    <div className="flex flex-col items-center justify-center p-6 py-16 text-center space-y-5 animate-in zoom-in-95 duration-200">
      <div className="size-14 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30">
        <AlertCircle className="size-7" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          Unable to Load Tracking Information
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
          We encountered an issue connecting to the courier dispatch network. The order may still be syncing or your network connection might be temporarily unstable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
        <Button
          onClick={onRetry}
          className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </Button>
        <Button
          variant="outline"
          onClick={onResetOrder}
          className="flex-1 h-9 rounded-xl text-xs"
        >
          <span>View Active Sample</span>
        </Button>
      </div>

      {/* Search Alternate Order */}
      <div className="w-full max-w-xs pt-4 border-t border-border/80">
        <p className="text-[11px] text-muted-foreground mb-2">
          Or look up a different order ID:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. ORD-849204"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary uppercase"
          />
          <Button
            size="sm"
            variant="secondary"
            className="rounded-xl text-xs h-8 px-3"
            onClick={onResetOrder}
          >
            <Search className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
