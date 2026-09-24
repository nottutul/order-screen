"use client"

import * as React from "react"
import {
  Truck,
  MapPin,
  FileText,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Edit2,
  ExternalLink,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/toast"
import { Modal } from "@/components/ui/modal"
import { Order } from "@/types/order"

interface CourierDetailsCardProps {
  order: Order
  onCallDriver?: () => void
  onMessageDriver?: () => void
  onUpdateDeliveryNotes?: (newNotes: string) => void
}

export function CourierDetailsCard({
  order,
  onCallDriver,
  onMessageDriver,
  onUpdateDeliveryNotes,
}: CourierDetailsCardProps) {
  const { toast } = useToast()
  const [copiedTracking, setCopiedTracking] = React.useState(false)
  const [isEditNotesOpen, setIsEditNotesOpen] = React.useState(false)
  const [notes, setNotes] = React.useState(
    order.shippingAddress.deliveryNotes || "Leave package at front door behind the planter."
  )

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(order.courier.trackingNumber)
    setCopiedTracking(true)
    toast({
      title: "Tracking Number Copied",
      description: `${order.courier.trackingNumber} copied to clipboard`,
      type: "success",
    })
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditNotesOpen(false)
    if (onUpdateDeliveryNotes) {
      onUpdateDeliveryNotes(notes)
    }
    toast({
      title: "Delivery Instructions Updated",
      description: "Driver will see your updated delivery note upon arrival.",
      type: "success",
    })
  }

  return (
    <>
      <Card className="border border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/60">
          <CardTitle className="text-sm font-bold sm:text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Courier & Shipping Info
            </span>
            <Badge variant="outline" className="text-[10px] font-normal py-0 px-2">
              {order.courier.carrierName}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Tracking Number Bar */}
          <div className="rounded-xl bg-muted/50 p-3 border border-border/60 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tracking Number
              </p>
              <p className="text-xs font-mono font-bold text-foreground truncate mt-0.5 sm:text-sm">
                {order.courier.trackingNumber}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0 rounded-lg"
              onClick={handleCopyTracking}
              disabled={order.status === "pending_tracking"}
            >
              {copiedTracking ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                Delivery Address
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-3 bg-card/60 text-xs space-y-0.5">
              <p className="font-semibold text-foreground">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
            </div>
          </div>

          {/* Delivery Instructions note */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                Delivery Instructions
              </p>
              <button
                type="button"
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
                onClick={() => setIsEditNotesOpen(true)}
              >
                <Edit2 className="size-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="italic">&quot;{notes}&quot;</p>
            </div>
          </div>

          {/* Driver Communication Quick Buttons if Out for Delivery */}
          {order.status === "out_for_delivery" && order.courier.driverPhone && (
            <div className="pt-1 flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 h-9 rounded-xl text-xs gap-1.5"
                onClick={onCallDriver}
              >
                <Phone className="size-3.5 text-emerald-500" />
                <span>Call Driver</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-9 rounded-xl text-xs gap-1.5"
                onClick={onMessageDriver}
              >
                <MessageSquare className="size-3.5 text-sky-500" />
                <span>Message Driver</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Instructions Modal */}
      <Modal
        isOpen={isEditNotesOpen}
        onClose={() => setIsEditNotesOpen(false)}
        title="Delivery Instructions"
        description="Provide safe drop-off guidance or gate access codes for the courier."
      >
        <form onSubmit={handleSaveNotes} className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Instructions for Driver
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              placeholder="e.g. Ring apartment 4B or leave in lockbox..."
              maxLength={150}
            />
            <p className="text-[10px] text-muted-foreground text-right mt-1">
              {notes.length}/150 characters
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl text-xs h-9"
              onClick={() => setIsEditNotesOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl text-xs h-9"
            >
              Save Instructions
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
