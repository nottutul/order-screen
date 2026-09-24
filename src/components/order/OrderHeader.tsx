"use client"

import * as React from "react"
import { ArrowLeft, Copy, Check, Share2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { Order } from "@/types/order"

interface OrderHeaderProps {
  order: Order
  onOpenSupport: () => void
}

export function OrderHeader({ order, onOpenSupport }: OrderHeaderProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState(false)

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(order.orderNumber)
    setCopied(true)
    toast({
      title: "Order ID Copied",
      description: `${order.orderNumber} copied to clipboard`,
      type: "success",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Track Order ${order.orderNumber}`,
        text: `Tracking status for order ${order.orderNumber}`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      toast({
        title: "Tracking Link Copied",
        description: "Shareable link copied to clipboard",
        type: "info",
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-foreground/80 hover:text-foreground"
          aria-label="Back to orders"
          onClick={() => {
            toast({
              title: "Navigation",
              description: "Returning to order history list",
              type: "info",
            })
          }}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
              {order.orderNumber}
            </h1>
            <button
              onClick={handleCopyOrderId}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              title="Copy Order Number"
              aria-label="Copy Order Number"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Placed on {order.placedDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted-foreground hover:text-foreground"
          onClick={handleShare}
          title="Share tracking details"
          aria-label="Share tracking"
        >
          <Share2 className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium border-border/80 shadow-xs"
          onClick={onOpenSupport}
          aria-label="Get Help"
        >
          <HelpCircle className="size-3.5 text-primary" />
          <span>Support</span>
        </Button>
      </div>
    </header>
  )
}
