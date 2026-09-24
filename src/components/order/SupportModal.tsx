"use client"

import * as React from "react"
import {
  MessageSquare,
  Phone,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Send,
} from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { Order } from "@/types/order"

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
  initialView?: "hub" | "report_missing" | "report_issue"
}

export function SupportModal({
  isOpen,
  onClose,
  order,
  initialView = "hub",
}: SupportModalProps) {
  const { toast } = useToast()
  const [activeView, setActiveView] = React.useState<"hub" | "report_issue" | "ticket_created">(() =>
    initialView === "report_missing" || initialView === "report_issue" ? "report_issue" : "hub"
  )
  const [selectedIssue, setSelectedIssue] = React.useState<string>("not_received")
  const [issueNotes, setIssueNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [ticketId, setTicketId] = React.useState("")

  // Adjust state during render when props change to avoid cascading renders in useEffect
  const [prevProps, setPrevProps] = React.useState({ initialView, isOpen })
  if (prevProps.initialView !== initialView || prevProps.isOpen !== isOpen) {
    setPrevProps({ initialView, isOpen })
    if (initialView === "report_missing") {
      setSelectedIssue("not_received")
      setActiveView("report_issue")
    } else if (initialView === "report_issue") {
      setActiveView("report_issue")
    } else {
      setActiveView("hub")
    }
    if (!isOpen) {
      setIssueNotes("")
      setTicketId("")
    }
  }

  const handleOpenLiveChat = () => {
    onClose()
    toast({
      title: "Connecting to Live Support",
      description: "Support specialist Sarah is joining your chat session...",
      type: "info",
    })
  }

  const handleCallCarrier = () => {
    onClose()
    window.location.href = `tel:${order.courier.supportPhone}`
  }

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const newTicket = "TKT-" + Math.floor(100000 + Math.random() * 900000)
      setTicketId(newTicket)
      setActiveView("ticket_created")
      toast({
        title: "Claim Submitted Successfully",
        description: `Ticket ${newTicket} filed with priority response`,
        type: "success",
      })
    }, 700)
  }

  const handleReset = () => {
    setActiveView("hub")
    setSelectedIssue("not_received")
    setIssueNotes("")
    setTicketId("")
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        activeView === "ticket_created"
          ? "Resolution In Progress"
          : activeView === "report_issue"
          ? "Report a Delivery Issue"
          : "Delivery Support & Help"
      }
      description={
        activeView === "ticket_created"
          ? `Claim ${ticketId} has been logged with our customer advocacy team.`
          : activeView === "report_issue"
          ? `Order #${order.orderNumber} • Select the issue and our team will resolve it.`
          : "Get immediate help with your package or courier delivery."
      }
    >
      {/* VIEW 1: SUPPORT HUB */}
      {activeView === "hub" && (
        <div className="space-y-3 py-1">
          {/* Channel 1: Live Chat */}
          <div
            onClick={handleOpenLiveChat}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-foreground sm:text-sm">24/7 Live Support Chat</p>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Instant response time (~1 min wait)
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Channel 2: Direct Carrier Call */}
          <div
            onClick={handleCallCarrier}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground sm:text-sm">
                  Call Carrier ({order.courier.carrierName})
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {order.courier.supportPhone}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Channel 3: Report Delivery Problem Form */}
          <div
            onClick={() => setActiveView("report_issue")}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/70 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground sm:text-sm">
                  File a Delivery Claim
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Package missing, damaged, or severely delayed
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full h-9 rounded-xl text-xs"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* VIEW 2: REPORT ISSUE FORM */}
      {activeView === "report_issue" && (
        <form onSubmit={handleSubmitIssue} className="space-y-4 py-1">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Select Issue Category:
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "not_received",
                  title: "Delivered but not received",
                  desc: "System says delivered, but package is missing from doorstep",
                },
                {
                  id: "delayed",
                  title: "Package significantly delayed",
                  desc: "Delivery time has passed with no update",
                },
                {
                  id: "damaged",
                  title: "Package or items damaged",
                  desc: "Box arrived crushed, open, or contents broken",
                },
                {
                  id: "wrong_address",
                  title: "Incorrect delivery address",
                  desc: "Need to redirect or update suite/apartment number",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedIssue(opt.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    selectedIssue === opt.id
                      ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                      : "border-border/80 bg-card hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="issueCategory"
                    checked={selectedIssue === opt.id}
                    onChange={() => setSelectedIssue(opt.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground">{opt.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
              rows={2}
              placeholder="Provide any helpful context for our team..."
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl text-xs h-9"
              onClick={() => setActiveView("hub")}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl text-xs h-9 bg-primary text-primary-foreground gap-1.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Submitting Claim...</span>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Submit Claim</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* VIEW 3: TICKET SUBMITTED SUCCESS */}
      {activeView === "ticket_created" && (
        <div className="space-y-4 py-2 text-center">
          <div className="size-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground">
              Claim Ticket Created
            </h3>
            <p className="text-xs font-mono font-bold text-primary mt-1">
              Ticket ID: #{ticketId}
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
              Our expedited delivery resolution team has been notified. You will receive an SMS update and email within 15–30 minutes with your refund or re-shipment confirmation.
            </p>
          </div>

          <div className="rounded-xl bg-muted/60 p-3 text-left text-xs border border-border/80 space-y-1">
            <p className="font-semibold text-foreground">What happens next?</p>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px]">
              <li>We will contact the carrier route dispatcher directly.</li>
              <li>If not located, a free replacement is automatically dispatched via overnight express.</li>
            </ul>
          </div>

          <Button
            className="w-full rounded-xl text-xs h-9 font-semibold"
            onClick={handleReset}
          >
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}
