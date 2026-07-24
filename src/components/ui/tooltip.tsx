import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TooltipProviderProps {
  children: React.ReactNode
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>
}

interface TooltipProps {
  children: React.ReactNode
  delayDuration?: number
}

export function Tooltip({ children, delayDuration = 200 }: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const onMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true)
    }, delayDuration)
  }

  const onMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if ((child.type as any).displayName === "TooltipTrigger") {
            return child
          }
          if ((child.type as any).displayName === "TooltipContent") {
            return (
              <AnimatePresence>
                {open && child}
              </AnimatePresence>
            )
          }
        }
        return child
      })}
    </div>
  )
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return children
  }
  return (
    <div className="inline-block cursor-help">
      {children}
    </div>
  )
}
TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
  side?: "top" | "bottom" | "left" | "right"
}

export function TooltipContent({ children, className, side = "top" }: TooltipContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: side === "top" ? 5 : -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: side === "top" ? 5 : -5 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={cn(
        "absolute z-[110] mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl whitespace-nowrap pointer-events-none",
        side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
        side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
        className
      )}
    >
      {children}
      <div className={cn(
        "absolute w-2 h-2 bg-slate-900 rotate-45",
        side === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
        side === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2"
      )} />
    </motion.div>
  )
}
TooltipContent.displayName = "TooltipContent"
