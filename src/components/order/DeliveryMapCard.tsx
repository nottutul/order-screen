"use client"

import * as React from "react"
import { MapPin, Navigation, Compass, Phone, ShieldCheck, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Order } from "@/types/order"

interface DeliveryMapCardProps {
  order: Order
  onCallDriver?: () => void
}

export function DeliveryMapCard({ order, onCallDriver }: DeliveryMapCardProps) {
  // Only show live courier tracking map if out_for_delivery or delivered
  if (order.status !== "out_for_delivery") {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-zinc-950 text-white shadow-md">
      {/* Simulated Map Canvas */}
      <div className="relative h-44 w-full bg-[#1c2128] overflow-hidden select-none">
        {/* Map Grid / Street Lines SVG */}
        <svg
          className="absolute inset-0 h-full w-full opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="street-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#2d333b"
                strokeWidth="1.5"
              />
            </pattern>
            {/* Route glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="#161b22" />
          <rect width="100%" height="100%" fill="url(#street-grid)" />

          {/* Secondary road arteries */}
          <path
            d="M -10 120 C 80 110, 180 140, 420 80"
            fill="none"
            stroke="#30363d"
            strokeWidth="5"
          />
          <path
            d="M 90 -10 C 110 70, 140 130, 160 200"
            fill="none"
            stroke="#30363d"
            strokeWidth="4"
          />
          <path
            d="M 270 -10 C 260 60, 290 120, 310 200"
            fill="none"
            stroke="#30363d"
            strokeWidth="3.5"
          />

          {/* Primary Route Path (Electric Blue) */}
          <path
            d="M 65 115 Q 120 110 150 75 T 235 60 T 310 110"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeDasharray="6 4"
            className="animate-[dash_20s_linear_infinite]"
          />

          {/* Destination Pin (Customer Home) */}
          <g transform="translate(310, 110)">
            <circle r="14" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
            <circle r="8" fill="#10b981" />
            <circle r="3" fill="#ffffff" />
          </g>

          {/* Courier Position Marker */}
          <g transform="translate(130, 85)">
            <circle r="16" fill="#0284c7" fillOpacity="0.3" className="animate-ping" />
            <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          </g>
        </svg>

        {/* Floating Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-zinc-900/90 px-3 py-1.5 backdrop-blur-md border border-white/10 text-xs shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-zinc-100">Live GPS Route</span>
            <span className="text-zinc-400">• ~8 mins away</span>
          </div>

          <div className="pointer-events-auto rounded-full bg-zinc-900/80 p-1.5 backdrop-blur-md border border-white/10 text-zinc-300">
            <Compass className="size-3.5" />
          </div>
        </div>

        {/* Bottom Destination Tag */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg bg-zinc-900/90 px-2.5 py-1 backdrop-blur-md border border-white/10 text-zinc-300">
            <MapPin className="size-3 text-emerald-400" />
            <span className="truncate max-w-[200px]">{order.shippingAddress.street}</span>
          </div>
        </div>
      </div>

      {/* Driver Info Strip under Map */}
      {order.courier.driverName && (
        <div className="flex items-center justify-between p-3.5 bg-card text-card-foreground border-t border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={order.courier.driverPhoto}
                alt={order.courier.driverName}
                className="size-10 rounded-full object-cover border border-border"
              />
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold sm:text-sm">{order.courier.driverName}</p>
                <span className="text-[11px] text-amber-500 font-medium">★ {order.courier.driverRating}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{order.courier.driverVehicle}</p>
            </div>
          </div>

          {onCallDriver && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full h-8 px-3 text-xs gap-1.5 border-border hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={onCallDriver}
            >
              <Phone className="size-3 text-emerald-500" />
              <span>Call</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
