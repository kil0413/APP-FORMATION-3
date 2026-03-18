import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#CC1A1A] text-white hover:bg-[#A31515] shadow-md shadow-red-500/20 active:scale-95",
      secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100",
      ghost: "text-[#CC1A1A] hover:bg-red-50",
      outline: "border border-[#CC1A1A] text-[#CC1A1A] hover:bg-red-50",
    }
    const sizes = {
      default: "h-12 px-6 py-2 rounded-xl text-base font-medium",
      sm: "h-9 rounded-lg px-3 text-sm font-medium",
      lg: "h-14 rounded-xl px-8 text-lg font-bold",
      icon: "h-10 w-10 rounded-full flex items-center justify-center",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-transform",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
