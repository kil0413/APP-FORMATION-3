import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-[#CC1A1A] text-white",
    secondary: "border-transparent bg-gray-100 text-gray-900",
    destructive: "border-transparent bg-red-500 text-white",
    outline: "text-gray-950",
    success: "border-transparent bg-[#34C759] text-white",
    warning: "border-transparent bg-[#FF9500] text-white",
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
