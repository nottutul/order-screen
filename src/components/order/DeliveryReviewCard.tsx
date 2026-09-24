"use client"

import * as React from "react"
import { Star, ThumbsUp, Heart, Check, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { Order } from "@/types/order"

interface DeliveryReviewCardProps {
  order: Order
}

export function DeliveryReviewCard({ order }: DeliveryReviewCardProps) {
  const { toast } = useToast()
  const [rating, setRating] = React.useState<number>(0)
  const [submitted, setSubmitted] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  if (order.status !== "delivered") return null

  const tags = ["On Time", "Left in Safe Spot", "Careful with Items", "Friendly Driver"]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
    toast({
      title: "Thank You for Your Feedback!",
      description: "Your rating was passed along to the delivery team.",
      type: "success",
    })
  }

  return (
    <Card className="border border-emerald-500/30 bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background p-4 sm:p-5 shadow-sm">
      {!submitted ? (
        <div className="text-center space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Delivery Completed
            </span>
            <h3 className="text-sm font-bold text-foreground sm:text-base mt-0.5">
              How did we do today?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rate your delivery experience with {order.courier.carrierName}
            </p>
          </div>

          {/* Star Rating Buttons */}
          <div className="flex justify-center items-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 text-muted-foreground/40 hover:text-amber-400 transition-colors"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`size-6 transition-all ${
                    rating >= star
                      ? "text-amber-400 fill-amber-400 scale-110"
                      : "text-muted-foreground/30 hover:scale-105"
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="space-y-3 pt-2 animate-in fade-in zoom-in-95">
              <div className="flex flex-wrap justify-center gap-1.5">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 font-medium"
                          : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>

              <Button
                size="sm"
                className="w-full h-8 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSubmit}
              >
                Submit Feedback
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-2 space-y-1">
          <div className="size-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="size-4" />
          </div>
          <p className="text-xs font-bold text-foreground">Feedback Received</p>
          <p className="text-[11px] text-muted-foreground">
            Thank you for helping us keep delivery standards exceptional.
          </p>
        </div>
      )}
    </Card>
  )
}
