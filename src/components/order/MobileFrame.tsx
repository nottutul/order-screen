"use client"

import * as React from "react"
import { Wifi, Battery, Signal } from "lucide-react"

interface MobileFrameProps {
  children: React.ReactNode
  isMobileFrame: boolean
  resetScrollTrigger?: unknown
}

export function MobileFrame({
  children,
  isMobileFrame,
  resetScrollTrigger,
}: MobileFrameProps) {
  const [time, setTime] = React.useState("9:41")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours() % 12 || 12
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setTime(`${hours}:${minutes}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  // Automatically scroll to top when scenario changes
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [resetScrollTrigger])

  if (!isMobileFrame) {
    return (
      <main className="w-full max-w-2xl mx-auto min-h-screen bg-background text-foreground transition-all">
        {children}
      </main>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-0 sm:py-6 sm:px-4 bg-muted/40 transition-all select-none sm:select-auto">
      {/* Smartphone Chassis Container: 390px corresponds to iPhone 15 Pro, strictly in 360px-430px target range */}
      <div className="relative w-full sm:w-[396px] min-h-screen sm:min-h-[850px] sm:max-h-[890px] bg-background text-foreground sm:rounded-[52px] sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] sm:border-[9px] sm:border-zinc-900 sm:ring-1 sm:ring-white/20 flex flex-col overflow-hidden">
        {/* Mobile Status Bar (Simulated on desktop frame) */}
        <div className="hidden sm:flex items-center justify-between px-7 pt-3.5 pb-1 select-none z-40 bg-background/95 backdrop-blur-md">
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            {time}
          </span>

          {/* Dynamic Island Notch */}
          <div className="h-4.5 w-24 rounded-full bg-black flex items-center justify-end px-2 gap-1.5 shadow-inner">
            <span className="size-2 rounded-full bg-zinc-800" />
            <span className="size-1.5 rounded-full bg-zinc-700" />
          </div>

          <div className="flex items-center gap-1.5 text-foreground">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <Battery className="size-3.5" />
          </div>
        </div>

        {/* Screen Scrollable Viewport with Hidden Scrollbar */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col relative [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        {/* Mobile Home Bar indicator */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-background select-none pointer-events-none">
          <div className="h-1 w-32 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  )
}
