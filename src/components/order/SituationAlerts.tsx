"use client"

import * as React from "react"
import {
  AlertTriangle,
  Gift,
  Copy,
  Check,
  Camera,
  MapPin,
  HelpCircle,
  Clock,
  Bell,
  BellRing,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { Modal } from "@/components/ui/modal"
import { Order } from "@/types/order"

// ==========================================
// SITUATION 1: DELAYED ORDER
// ==========================================
interface DelayedOrderAlertProps {
  order: Order
  onContactSupport: () => void
  onReschedule: () => void
}

export function DelayedOrderAlert({
  order,
  onContactSupport,
  onReschedule,
}: DelayedOrderAlertProps) {
  const { toast } = useToast()
  const [copiedCode, setCopiedCode] = React.useState(false)

  if (!order.isDelayed && order.status !== "delayed") return null

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(true)
    toast({
      title: "Credit Code Copied",
      description: `${code} copied to clipboard! Use at checkout.`,
      type: "success",
    })
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <Card className="border-2 border-amber-500/40 bg-gradient-to-b from-amber-50/90 via-amber-50/40 to-background dark:from-amber-950/40 dark:via-amber-950/15 dark:to-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
          <AlertTriangle className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Notice of Delay
            </span>
            <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-medium">
              Priority Express
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5 leading-snug">
            Your package is taking slightly longer than expected
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {order.delayReason ||
              "Transit conditions in the regional sorting hub delayed linehaul flights. Drivers are prioritizing your package for next run."}
          </p>
        </div>
      </div>

      {/* New ETA Callout */}
      <div className="mt-3.5 rounded-xl border border-amber-300/60 dark:border-amber-800/60 bg-amber-100/60 dark:bg-amber-900/30 p-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-800 dark:text-amber-300 block">
            Guaranteed Revised Window
          </span>
          <span className="text-xs font-bold text-amber-950 dark:text-amber-100 block truncate sm:text-sm">
            {order.newEstimatedDelivery || "Tomorrow morning by 1:30 PM"}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs rounded-lg shrink-0 border-amber-400 dark:border-amber-700 bg-background/80 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          onClick={onReschedule}
        >
          Reschedule
        </Button>
      </div>

      {/* Compensation Card */}
      {order.compensation && (
        <div className="mt-3 rounded-xl border border-border/80 bg-background/90 p-3 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Gift className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-foreground">
                  {order.compensation.amount}
                </span>
                <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                  {order.compensation.code}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                Automatic delay credit applied to balance
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2 shrink-0 gap-1 text-primary hover:text-primary/80"
            onClick={() => handleCopyCode(order.compensation!.code)}
          >
            {copiedCode ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-[11px] text-emerald-600 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 pt-1">
        <Button
          size="sm"
          className="h-8 text-xs rounded-xl w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          onClick={onContactSupport}
        >
          <HelpCircle className="size-3.5 mr-1" />
          Priority Support Inquire
        </Button>
      </div>
    </Card>
  )
}

// ==========================================
// SITUATION 2: DELIVERED BUT NOT RECEIVED
// ==========================================
interface MissingDeliveryCardProps {
  order: Order
  onReportMissing: () => void
}

export function MissingDeliveryCard({
  order,
  onReportMissing,
}: MissingDeliveryCardProps) {
  const [showProofModal, setShowProofModal] = React.useState(false)
  const [checklist, setChecklist] = React.useState({
    porch: false,
    neighbors: false,
    mailroom: false,
  })

  // Only relevant for delivered orders
  if (order.status !== "delivered") return null

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <Card className="border-2 border-rose-500/30 bg-gradient-to-b from-rose-50/70 via-rose-50/20 to-background dark:from-rose-950/30 dark:via-rose-950/10 dark:to-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <ShieldAlert className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Delivery Protection
              </span>
              <Badge variant="destructive" className="text-[10px] py-0 px-1.5 font-medium">
                Action Available
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-0.5 leading-snug">
              Can&apos;t find your package?
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              If the status says delivered but it&apos;s not in your hands, our delivery protection covers instant replacements or full refunds.
            </p>
          </div>
        </div>

        {/* Proof of delivery snapshot button if available */}
        {order.deliveryProof && (
          <div className="mt-3.5 rounded-xl border border-border/80 bg-background/90 p-2.5 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="size-10 rounded-lg overflow-hidden border border-border shrink-0 bg-muted relative">
                <img
                  src={order.deliveryProof.photoUrl}
                  alt="Delivery drop proof"
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Camera className="size-3 text-primary shrink-0" />
                  <span>Proof Photo</span>
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {order.deliveryProof.locationDescription}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs rounded-lg px-2 shrink-0"
              onClick={() => setShowProofModal(true)}
            >
              View
            </Button>
          </div>
        )}

        {/* Interactive Guided Checklist */}
        <div className="mt-3 rounded-xl bg-muted/50 p-3 border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Quick 1-Minute Verification Checklist:
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              className="w-full flex items-center gap-2 text-left text-xs text-foreground/90 hover:text-foreground p-0.5 rounded transition-colors"
              onClick={() => toggleCheck("porch")}
            >
              {checklist.porch ? (
                <CheckSquare className="size-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Square className="size-3.5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-[11px] leading-tight ${checklist.porch ? "line-through text-muted-foreground" : ""}`}>
                Checked side doors, back porch, or behind planters
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 text-left text-xs text-foreground/90 hover:text-foreground p-0.5 rounded transition-colors"
              onClick={() => toggleCheck("mailroom")}
            >
              {checklist.mailroom ? (
                <CheckSquare className="size-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Square className="size-3.5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-[11px] leading-tight ${checklist.mailroom ? "line-through text-muted-foreground" : ""}`}>
                Checked lobby, mailroom, or package lockbox
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 text-left text-xs text-foreground/90 hover:text-foreground p-0.5 rounded transition-colors"
              onClick={() => toggleCheck("neighbors")}
            >
              {checklist.neighbors ? (
                <CheckSquare className="size-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Square className="size-3.5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-[11px] leading-tight ${checklist.neighbors ? "line-through text-muted-foreground" : ""}`}>
                Checked with adjacent neighbors or front desk
              </span>
            </button>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-3">
          <Button
            size="default"
            variant="destructive"
            className="w-full h-8.5 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
            onClick={onReportMissing}
          >
            <ShieldAlert className="size-3.5" />
            <span>Package Not Found — File Missing Claim</span>
          </Button>
          <p className="text-[10px] text-center text-muted-foreground mt-1">
            Protected by 100% Delivery Guarantee • Instant review
          </p>
        </div>
      </Card>

      {/* Proof Photo Modal */}
      {order.deliveryProof && (
        <Modal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          title="Courier Proof of Delivery"
          description={`Captured ${order.deliveryProof.deliveredAt}`}
        >
          <div className="space-y-4 py-1">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-inner bg-black">
              <img
                src={order.deliveryProof.photoUrl}
                alt="Courier drop snapshot"
                className="w-full h-64 object-cover sm:h-72"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md rounded-lg p-2 text-white text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="size-3 text-emerald-400" />
                  GPS Geo-Stamp Verified
                </span>
                <span className="text-zinc-300">{order.deliveryProof.deliveredAt}</span>
              </div>
            </div>

            <div className="rounded-xl bg-muted p-3 text-xs space-y-1">
              <p className="font-semibold text-foreground">Drop-off Description:</p>
              <p className="text-muted-foreground leading-relaxed">
                &quot;{order.deliveryProof.locationDescription}&quot;
              </p>
              {order.deliveryProof.signedBy && (
                <p className="text-muted-foreground pt-1 border-t border-border/50 text-[11px]">
                  Verification: <span className="font-medium text-foreground">{order.deliveryProof.signedBy}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs h-9"
                onClick={() => setShowProofModal(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl text-xs h-9"
                onClick={() => {
                  setShowProofModal(false)
                  onReportMissing()
                }}
              >
                Not My Doorstep
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

// ==========================================
// SITUATION 3: TRACKING NOT AVAILABLE YET
// ==========================================
interface PendingTrackingCardProps {
  order: Order
  onEditAddress: () => void
}

export function PendingTrackingCard({
  order,
  onEditAddress,
}: PendingTrackingCardProps) {
  const { toast } = useToast()
  const [subscribed, setSubscribed] = React.useState(false)

  if (order.status !== "pending_tracking") return null

  const handleToggleAlerts = () => {
    setSubscribed(!subscribed)
    toast({
      title: !subscribed ? "Tracking Alerts Enabled" : "Alerts Turned Off",
      description: !subscribed
        ? "We'll send you an SMS and email the second FedEx scans your package!"
        : "You will no longer receive automated SMS updates.",
      type: !subscribed ? "success" : "info",
    })
  }

  return (
    <Card className="border border-purple-500/30 bg-gradient-to-b from-purple-50/70 via-indigo-50/20 to-background dark:from-purple-950/30 dark:via-indigo-950/15 dark:to-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
          <Clock className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Fulfillment In Progress
            </span>
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-medium">
              Stage 1 of 4
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5 leading-snug">
            Tracking details are generating
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Your order is being picked, packed, and boxed at our fulfillment center. Real-time carrier tracking activates as soon as FedEx scans the shipment parcel.
          </p>
        </div>
      </div>

      {/* Progress Milestone Bar */}
      <div className="mt-3.5 rounded-xl bg-background/90 p-3 border border-border/80 shadow-2xs">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-foreground text-[11px]">Packing & Quality Check</span>
          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
            ~3 hours to dispatch
          </span>
        </div>

        {/* Progress bar visual */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full w-2/5 rounded-full bg-purple-600 animate-pulse" />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Carrier: FedEx Express Priority</span>
          <span>Pickup: Today by 5:30 PM</span>
        </div>
      </div>

      {/* Stacked Action Buttons on Mobile Viewport */}
      <div className="mt-3.5 flex flex-col gap-2">
        <Button
          size="sm"
          variant={subscribed ? "outline" : "default"}
          className={`h-8.5 w-full rounded-xl text-xs gap-1.5 ${
            subscribed
              ? "border-purple-400 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30"
              : "bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          }`}
          onClick={handleToggleAlerts}
        >
          {subscribed ? (
            <>
              <BellRing className="size-3.5 text-purple-600" />
              <span>Subscribed to Live SMS Updates</span>
            </>
          ) : (
            <>
              <Bell className="size-3.5" />
              <span>Notify Me When Label Scans</span>
            </>
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-8 w-full rounded-xl text-xs border-border/80"
          onClick={onEditAddress}
        >
          Change Delivery Address
        </Button>
      </div>
    </Card>
  )
}
