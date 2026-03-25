import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-red-600 text-white shadow-lg shadow-red-600/20",
    secondary: "border-white/5 bg-white/10 text-white/70",
    destructive: "border-transparent bg-red-900 text-red-200",
    outline: "border-white/20 text-white/50",
    success: "border-transparent bg-green-600/20 text-green-400 border border-green-600/30",
    warning: "border-transparent bg-orange-600/20 text-orange-400 border border-orange-600/30",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
