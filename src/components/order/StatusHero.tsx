"use client"

import * as React from "react"
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Order } from "@/types/order"

interface StatusHeroProps {
  order: Order
}

export function StatusHero({ order }: StatusHeroProps) {
  const getStatusConfig = () => {
    switch (order.status) {
      case "out_for_delivery":
        return {
          icon: Truck,
          badgeText: "Out for Delivery",
          badgeVariant: "info" as const,
          accentBg: "from-sky-500/10 via-blue-500/5 to-transparent border-sky-500/30",
          iconColor: "text-sky-600 dark:text-sky-400 bg-sky-500/15 border-sky-500/30",
          pulse: true,
        }
      case "delayed":
        return {
          icon: AlertTriangle,
          badgeText: "Shipment Delayed",
          badgeVariant: "warning" as const,
          accentBg: "from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30",
          iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30",
          pulse: false,
        }
      case "delivered":
        return {
          icon: CheckCircle2,
          badgeText: "Delivered",
          badgeVariant: "success" as const,
          accentBg: "from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30",
          iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
          pulse: false,
        }
      case "pending_tracking":
        return {
          icon: Package,
          badgeText: "Preparing Package",
          badgeVariant: "secondary" as const,
          accentBg: "from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/30",
          iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/15 border-purple-500/30",
          pulse: true,
        }
      default:
        return {
          icon: Clock,
          badgeText: "In Transit",
          badgeVariant: "default" as const,
          accentBg: "from-primary/10 via-primary/5 to-transparent border-primary/20",
          iconColor: "text-primary bg-primary/10 border-primary/20",
          pulse: false,
        }
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-b ${config.accentBg} p-5 border shadow-sm transition-all`}
    >
      {/* Decorative ambient background glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Status Bar with Badge & Live Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <Badge variant={config.badgeVariant} className="px-3 py-1 font-semibold text-xs gap-1.5 shadow-xs">
            {config.pulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
              </span>
            )}
            {config.badgeText}
          </Badge>
          {order.courier.stopsAway !== undefined && order.status === "out_for_delivery" && (
            <span className="inline-flex items-center text-[11px] font-medium text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-300/40 dark:border-sky-800/40">
              <MapPin className="size-3 mr-1 inline" />
              {order.courier.stopsAway} stops away
            </span>
          )}
        </div>

        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
          <Clock className="size-3 text-muted-foreground/80" />
          Live Tracking
        </span>
      </div>

      {/* Main Headline & Description */}
      <div className="flex items-start gap-3.5 mb-4">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-inner ${config.iconColor}`}
        >
          <IconComponent className="size-5.5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground tracking-tight sm:text-xl leading-tight">
            {order.statusHeadline}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm leading-relaxed">
            {order.statusMessage}
          </p>
        </div>
      </div>

      {/* ETA Highlight Card */}
      <div className="rounded-xl border border-border/70 bg-background/80 p-3.5 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Calendar className="size-4.5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {order.isDelayed ? "Revised Delivery Window" : "Estimated Arrival"}
            </p>
            <p className="text-sm font-bold text-foreground">
              {order.isDelayed ? order.newEstimatedDelivery : order.estimatedDelivery}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Window</p>
          <p className="text-xs font-semibold text-foreground/90">
            {order.estimatedDeliveryWindow}
          </p>
        </div>
      </div>
    </Card>
  )
}
