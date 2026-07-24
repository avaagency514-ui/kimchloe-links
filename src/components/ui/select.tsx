'use client'

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export function Select({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) {
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
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className }: { children: React.ReactNode, className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors",
        className
      )}
    >
      {children}
      <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", context.open && "rotate-180")} />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  return (
    <span className="truncate">
      {context.value || placeholder}
    </span>
  )
}

export function SelectContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className={cn(
            "absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden py-1",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SelectItem({ children, value, className }: { children: React.ReactNode, value: string, className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  
  const isSelected = context.value === value

  return (
    <div
      onClick={() => {
        context.onValueChange(value)
        context.setOpen(false)
      }}
      className={cn(
        "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 transition-colors",
        isSelected ? "text-indigo-600 bg-indigo-50/50 font-black" : "text-slate-600 font-bold",
        className
      )}
    >
      {children}
      {isSelected && <Check className="w-4 h-4" />}
    </div>
  )
}
