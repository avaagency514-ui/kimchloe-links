'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface PopoverProps {
  children: React.ReactNode
}

export function Popover({ children }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if ((child.type as any).displayName === "PopoverTrigger") {
            return React.cloneElement(child as React.ReactElement<any>, { 
               onClick: () => setOpen(!open) 
            })
          }
          if ((child.type as any).displayName === "PopoverContent") {
            return (
              <AnimatePresence>
                {open && React.cloneElement(child as React.ReactElement<any>, { 
                  setOpen 
                })}
              </AnimatePresence>
            )
          }
        }
        return child
      })}
    </div>
  )
}

interface PopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
}

export function PopoverTrigger({ children, asChild, onClick }: PopoverTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick })
  }
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  )
}
PopoverTrigger.displayName = "PopoverTrigger"

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  setOpen?: (open: boolean) => void
}

export function PopoverContent({ children, className, align = "center", setOpen }: PopoverContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "absolute z-[100] mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl p-4 min-w-[200px]",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
      onClick={() => setOpen?.(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </motion.div>
  )
}
PopoverContent.displayName = "PopoverContent"
