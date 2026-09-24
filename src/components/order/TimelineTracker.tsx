"use client"

import * as React from "react"
import {
  Check,
  Truck,
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrackingStep } from "@/types/order"
import { cn } from "@/lib/utils"

interface TimelineTrackerProps {
  timeline: TrackingStep[]
}

export function TimelineTracker({ timeline }: TimelineTrackerProps) {
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({
    // Expand current step or delayed step by default
    ...timeline.reduce((acc, step) => {
      if (step.status === "current" || step.status === "delayed") {
        acc[step.id] = true
      }
      return acc
    }, {} as Record<string, boolean>),
  })

  const toggleStep = (id: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getStepIcon = (step: TrackingStep) => {
    switch (step.status) {
      case "completed":
        return <Check className="size-3.5 text-white stroke-[2.5]" />
      case "delayed":
        return <AlertTriangle className="size-3.5 text-white stroke-[2.5]" />
      case "current":
        return <Truck className="size-3.5 text-white stroke-[2.5]" />
      case "upcoming":
      default:
        return <Circle className="size-2 text-muted-foreground fill-current" />
    }
  }

  const getStepNodeStyle = (status: TrackingStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-600 border-emerald-600 shadow-xs shadow-emerald-500/20"
      case "delayed":
        return "bg-amber-600 border-amber-600 shadow-xs shadow-amber-500/20"
      case "current":
        return "bg-sky-600 border-sky-500 ring-4 ring-sky-500/25 animate-pulse"
      case "upcoming":
      default:
        return "bg-muted border-border text-muted-foreground"
    }
  }

  const getLineStyle = (currStatus: TrackingStep["status"], nextStatus?: TrackingStep["status"]) => {
    if (currStatus === "completed" && (nextStatus === "completed" || nextStatus === "current" || nextStatus === "delayed")) {
      return "bg-emerald-600"
    }
    if (currStatus === "delayed") {
      return "bg-amber-500/60"
    }
    return "bg-border/60 border-dashed"
  }

  return (
    <Card className="border border-border/80 shadow-sm overflow-hidden">
      <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold sm:text-base flex items-center gap-2">
            <span>Delivery Timeline</span>
            <Badge variant="outline" className="text-[10px] font-normal py-0 px-2 h-5">
              Live Updates
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step tracking progress
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-4">
        <div className="relative pl-1">
          {timeline.map((step, index) => {
            const isLast = index === timeline.length - 1
            const nextStep = !isLast ? timeline[index + 1] : undefined
            const isExpanded = !!expandedSteps[step.id]
            const hasDetails = step.details && step.details.length > 0

            return (
              <div key={step.id} className="relative flex gap-3.5 pb-6 last:pb-1 group">
                {/* Vertical Line Connector */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[13px] top-[26px] bottom-0 w-[2px] transition-colors",
                      getLineStyle(step.status, nextStep?.status)
                    )}
                  />
                )}

                {/* Node Icon */}
                <div
                  className={cn(
                    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 mt-0.5",
                    getStepNodeStyle(step.status)
                  )}
                >
                  {getStepIcon(step)}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "rounded-xl p-2.5 -m-1 transition-colors",
                      step.status === "current" && "bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-900/40",
                      step.status === "delayed" && "bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40",
                      hasDetails && "cursor-pointer hover:bg-muted/40"
                    )}
                    onClick={() => hasDetails && toggleStep(step.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={cn(
                            "text-xs font-bold leading-tight sm:text-sm",
                            step.status === "current" && "text-sky-950 dark:text-sky-200",
                            step.status === "delayed" && "text-amber-950 dark:text-amber-200",
                            step.status === "completed" && "text-foreground",
                            step.status === "upcoming" && "text-muted-foreground font-medium"
                          )}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {step.subtitle}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={cn(
                            "text-[10px] font-medium block",
                            step.status === "delayed"
                              ? "text-amber-600 dark:text-amber-400 font-bold"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.timestamp}
                        </span>
                        {step.location && (
                          <span className="text-[10px] text-muted-foreground/80 flex items-center justify-end gap-0.5 mt-0.5">
                            <MapPin className="size-2.5 inline" />
                            {step.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable sub-details */}
                    {hasDetails && (
                      <div className="mt-2 pt-2 border-t border-border/40">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-medium text-[10px] uppercase tracking-wider">
                            Activity Log ({step.details?.length})
                          </span>
                          <button
                            type="button"
                            className="flex items-center gap-0.5 text-xs text-primary hover:underline"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStep(step.id)
                            }}
                          >
                            <span>{isExpanded ? "Hide" : "View"}</span>
                            {isExpanded ? (
                              <ChevronUp className="size-3" />
                            ) : (
                              <ChevronDown className="size-3" />
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <ul className="mt-1.5 space-y-1 text-[11px] text-muted-foreground/90 pl-3 border-l-2 border-primary/30">
                            {step.details?.map((detail, dIdx) => (
                              <li key={dIdx} className="leading-snug">
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
