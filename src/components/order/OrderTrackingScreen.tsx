"use client"

import * as React from "react"
import { MOCK_ORDERS } from "@/data/mockOrders"
import { Order, ScenarioType } from "@/types/order"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { ScenarioController } from "./ScenarioController"
import { MobileFrame } from "./MobileFrame"
import { OrderHeader } from "./OrderHeader"
import { StatusHero } from "./StatusHero"
import { DeliveryMapCard } from "./DeliveryMapCard"
import { TimelineTracker } from "./TimelineTracker"
import {
  DelayedOrderAlert,
  MissingDeliveryCard,
  PendingTrackingCard,
} from "./SituationAlerts"
import { OrderItemsCard } from "./OrderItemsCard"
import { CourierDetailsCard } from "./CourierDetailsCard"
import { DeliveryReviewCard } from "./DeliveryReviewCard"
import { SupportModal } from "./SupportModal"
import { LoadingState, ErrorState } from "./StateViews"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { HelpCircle, Calendar, MapPin } from "lucide-react"

export function OrderTrackingScreen() {
  return (
    <ToastProvider>
      <OrderTrackingInner />
    </ToastProvider>
  )
}

function OrderTrackingInner() {
  const { toast } = useToast()
  const [currentScenario, setCurrentScenario] = React.useState<ScenarioType>("out_for_delivery")
  const [isMobileFrame, setIsMobileFrame] = React.useState<boolean>(true)
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false)

  // Order data state with ability to override
  const [ordersState, setOrdersState] = React.useState<Record<string, Order>>(MOCK_ORDERS)

  // Modals state
  const [isSupportOpen, setIsSupportOpen] = React.useState(false)
  const [supportInitialView, setSupportInitialView] = React.useState<"hub" | "report_missing" | "report_issue">("hub")
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)

  // Reschedule form state
  const [selectedSlot, setSelectedSlot] = React.useState("Tomorrow, Sep 26 (10:00 AM - 1:00 PM)")

  // Edit address form state
  const [newStreet, setNewStreet] = React.useState("742 Evergreen Terrace, Apt 4B")
  const [newCity, setNewCity] = React.useState("Springfield, OR 97477")

  // Dark mode effect
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const currentOrder =
    currentScenario !== "loading" && currentScenario !== "error"
      ? ordersState[currentScenario] || ordersState.out_for_delivery
      : ordersState.out_for_delivery

  // Handlers
  const handleOpenSupport = (view: "hub" | "report_missing" | "report_issue" = "hub") => {
    setSupportInitialView(view)
    setIsSupportOpen(true)
  }

  const handleCallDriver = () => {
    toast({
      title: "Calling Courier Driver",
      description: `Connecting to ${currentOrder.courier.driverName || "Driver"} (${currentOrder.courier.driverPhone || "Direct Line"})...`,
      type: "info",
    })
  }

  const handleMessageDriver = () => {
    toast({
      title: "Driver In-App Chat",
      description: "Direct messaging session opened with Marcus Vance.",
      type: "info",
    })
  }

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault()
    setIsRescheduleOpen(false)
    toast({
      title: "Delivery Rescheduled",
      description: `Your delivery window has been updated to ${selectedSlot}.`,
      type: "success",
    })
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddressModalOpen(false)
    setOrdersState((prev) => ({
      ...prev,
      [currentScenario]: {
        ...prev[currentScenario],
        shippingAddress: {
          ...prev[currentScenario].shippingAddress,
          street: newStreet,
        },
      },
    }))
    toast({
      title: "Delivery Address Updated",
      description: "Package routing updated before carrier dispatch scan.",
      type: "success",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased text-foreground">
      {/* Top Scenario Control Toolbar */}
      <ScenarioController
        currentScenario={currentScenario}
        onSelectScenario={(s) => setCurrentScenario(s)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Viewport Container */}
      <MobileFrame isMobileFrame={isMobileFrame} resetScrollTrigger={currentScenario}>
        {currentScenario === "loading" ? (
          <LoadingState />
        ) : currentScenario === "error" ? (
          <ErrorState
            onRetry={() => {
              setCurrentScenario("loading")
              setTimeout(() => setCurrentScenario("out_for_delivery"), 1000)
            }}
            onResetOrder={() => setCurrentScenario("out_for_delivery")}
          />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Top Mobile App Header */}
            <OrderHeader
              order={currentOrder}
              onOpenSupport={() => handleOpenSupport("hub")}
            />

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-5 space-y-4 pb-16">
              {/* Prominent Active Status & ETA Hero Card */}
              <StatusHero order={currentOrder} />

              {/* SITUATION 1: Delayed Order Notice & Action Card */}
              <DelayedOrderAlert
                order={currentOrder}
                onContactSupport={() => handleOpenSupport("report_issue")}
                onReschedule={() => setIsRescheduleOpen(true)}
              />

              {/* SITUATION 2: Delivered But Not Received Guided Checklist & Claim */}
              <MissingDeliveryCard
                order={currentOrder}
                onReportMissing={() => handleOpenSupport("report_missing")}
              />

              {/* SITUATION 3: Tracking Not Available Yet Stage Card */}
              <PendingTrackingCard
                order={currentOrder}
                onEditAddress={() => setIsAddressModalOpen(true)}
              />

              {/* Live Interactive Courier GPS Map */}
              <DeliveryMapCard
                order={currentOrder}
                onCallDriver={handleCallDriver}
              />

              {/* Visual Step-by-Step Delivery Timeline */}
              <TimelineTracker timeline={currentOrder.timeline} />

              {/* Post-Delivery Feedback / Rating Card */}
              <DeliveryReviewCard order={currentOrder} />

              {/* Courier & Address Details */}
              <CourierDetailsCard
                order={currentOrder}
                onCallDriver={handleCallDriver}
                onMessageDriver={handleMessageDriver}
                onUpdateDeliveryNotes={(notes) => {
                  setOrdersState((prev) => ({
                    ...prev,
                    [currentScenario]: {
                      ...prev[currentScenario],
                      shippingAddress: {
                        ...prev[currentScenario].shippingAddress,
                        deliveryNotes: notes,
                      },
                    },
                  }))
                }}
              />

              {/* Concise Order Products & Payment Summary */}
              <OrderItemsCard order={currentOrder} />

              {/* Bottom Quick Help Trigger */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 text-center space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Have questions about this delivery?
                </p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  Our customer experience team is available 24/7 to guarantee your satisfaction.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs h-8 px-4 gap-1.5 border-border shadow-xs"
                  onClick={() => handleOpenSupport("hub")}
                >
                  <HelpCircle className="size-3.5 text-primary" />
                  <span>Contact Delivery Support</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </MobileFrame>

      {/* Support & Dispute Resolution Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        order={currentOrder}
        initialView={supportInitialView}
      />

      {/* Reschedule Delivery Modal for Delayed Orders */}
      <Modal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        title="Reschedule Delivery"
        description="Choose a guaranteed delivery slot that works best for your schedule."
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4 py-1">
          <div className="space-y-2">
            {[
              "Tomorrow, Sep 26 (10:00 AM - 1:00 PM)",
              "Tomorrow, Sep 26 (2:00 PM - 6:00 PM)",
              "Saturday, Sep 27 (Morning Priority Drop)",
              "Hold at local FedEx Facility for Pickup",
            ].map((slot) => (
              <label
                key={slot}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedSlot === slot
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border/80 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="rescheduleSlot"
                  checked={selectedSlot === slot}
                  onChange={() => setSelectedSlot(slot)}
                />
                <span>{slot}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl text-xs h-9"
              onClick={() => setIsRescheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl text-xs h-9"
            >
              Confirm Reschedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Address Modal (for Pending Tracking or Before Dispatch) */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Update Delivery Address"
        description="Address changes can only be applied prior to carrier departure."
      >
        <form onSubmit={handleSaveAddress} className="space-y-3.5 py-1">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              City, State & Zip
            </label>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl text-xs h-9"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl text-xs h-9"
            >
              Update Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
