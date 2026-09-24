"use client"

import * as React from "react"
import {
  Package,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  Receipt,
  CheckCircle,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/toast"
import { Order } from "@/types/order"

interface OrderItemsCardProps {
  order: Order
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const { toast } = useToast()

  const handleDownloadInvoice = () => {
    toast({
      title: "Downloading Receipt",
      description: `Invoice for ${order.orderNumber} downloaded as PDF`,
      type: "success",
    })
  }

  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="border border-border/80 shadow-sm overflow-hidden">
      <CardHeader
        className="p-4 sm:p-5 cursor-pointer hover:bg-muted/30 transition-colors flex flex-row items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package className="size-4.5" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold sm:text-base">
              Order Summary ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              ${order.pricing.total.toFixed(2)} • Paid via {order.paymentMethod.type}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-1 rounded-full"
          aria-label={isOpen ? "Collapse order items" : "Expand order items"}
        >
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
          <Separator className="mb-4" />

          {/* Product Items List */}
          <div className="space-y-3.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="size-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 rounded-full bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    x{item.quantity}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground leading-tight truncate sm:text-sm">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {item.variant}
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Cost Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">${order.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span className="font-medium text-foreground">
                {order.pricing.shipping === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[11px]">Free Express</span>
                ) : (
                  `$${order.pricing.shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Promotional Discount</span>
                <span className="font-medium">-${order.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax</span>
              <span className="font-medium text-foreground">${order.pricing.tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Total Amount</span>
              <span className="text-base font-extrabold">${order.pricing.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method & Invoice Download */}
          <div className="mt-4 rounded-xl bg-muted/50 p-3 border border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">
                  {order.paymentMethod.type} (•••• {order.paymentMethod.last4})
                </p>
                <p className="text-[10px] text-muted-foreground">Payment Authorized & Verified</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2 gap-1 text-primary hover:text-primary/80"
              onClick={handleDownloadInvoice}
            >
              <Download className="size-3" />
              <span>Invoice</span>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
