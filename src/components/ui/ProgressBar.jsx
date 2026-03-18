import * as React from "react"
import { cn } from "../../lib/utils"

const ProgressBar = React.forwardRef(({ className, value, max = 100, colorClass = "bg-[#CC1A1A]", ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", colorClass)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
