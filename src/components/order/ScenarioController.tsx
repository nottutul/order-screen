"use client"

import * as React from "react"
import {
  Smartphone,
  Maximize2,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Truck,
  RotateCw,
  Sun,
  Moon,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScenarioType } from "@/types/order"

interface ScenarioControllerProps {
  currentScenario: ScenarioType
  onSelectScenario: (scenario: ScenarioType) => void
  isMobileFrame: boolean
  onToggleMobileFrame: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function ScenarioController({
  currentScenario,
  onSelectScenario,
  isMobileFrame,
  onToggleMobileFrame,
  isDarkMode,
  onToggleDarkMode,
}: ScenarioControllerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const scenarios: { id: ScenarioType; label: string; tag: string; icon: LucideIcon }[] = [
    {
      id: "out_for_delivery",
      label: "Out for Delivery",
      tag: "Live Route",
      icon: Truck,
    },
    {
      id: "delayed",
      label: "Delayed Order",
      tag: "Situation 1",
      icon: AlertTriangle,
    },
    {
      id: "delivered_not_received",
      label: "Delivered Not Received",
      tag: "Situation 2",
      icon: HelpCircle,
    },
    {
      id: "pending_tracking",
      label: "Tracking Not Ready",
      tag: "Situation 3",
      icon: Clock,
    },
    {
      id: "standard_delivered",
      label: "Delivered (Success)",
      tag: "Completed",
      icon: CheckCircle2,
    },
    {
      id: "loading",
      label: "Skeleton Loading",
      tag: "State",
      icon: RotateCw,
    },
    {
      id: "error",
      label: "Error / Not Found",
      tag: "State",
      icon: AlertTriangle,
    },
  ]

  const activeScenarioObj = scenarios.find((s) => s.id === currentScenario) || scenarios[0]

  return (
    <div className="w-full bg-zinc-950 text-white border-b border-zinc-800 shadow-md transition-all">
      <div className="max-w-6xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Branding & Scenario Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white pr-2 border-r border-zinc-800">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="hidden sm:inline">Order Tracking Screen</span>
            <span className="sm:hidden">OT Screen</span>
          </div>

          {/* Quick Scenario Pills (Desktop / Tablet) */}
          <div className="hidden lg:flex items-center gap-1">
            {scenarios.map((s) => {
              const Icon = s.icon
              const isActive = currentScenario === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectScenario(s.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isActive
                      ? "bg-white text-zinc-950 font-bold shadow-xs scale-105"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{s.label}</span>
                  {s.tag.startsWith("Situation") && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isActive ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {s.tag}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Mobile / Compact Scenario Menu Button */}
          <div className="lg:hidden relative">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs rounded-full border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white gap-1.5"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>{activeScenarioObj.label}</span>
              <Badge variant="secondary" className="text-[9px] py-0 px-1 bg-zinc-800 text-zinc-300">
                {activeScenarioObj.tag}
              </Badge>
              <ChevronDown className="size-3 text-zinc-400" />
            </Button>

            {isExpanded && (
              <div className="absolute left-0 top-9 z-50 w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95">
                {scenarios.map((s) => {
                  const Icon = s.icon
                  const isActive = currentScenario === s.id
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectScenario(s.id)
                        setIsExpanded(false)
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isActive
                          ? "bg-white/10 text-white font-bold"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-3.5" />
                        <span>{s.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {s.tag}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Device Viewport Toggle & Dark Mode */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-xs gap-1"
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? "Switch to fluid full width" : "Switch to mobile 390px frame"}
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="size-3.5" />
                <span className="hidden md:inline">Fluid Mode</span>
              </>
            ) : (
              <>
                <Smartphone className="size-3.5" />
                <span className="hidden md:inline">390px Mobile View</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
            onClick={onToggleDarkMode}
            title="Toggle light/dark theme"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
