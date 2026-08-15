import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[1rem] border border-black/10 bg-black/[0.02] px-4 py-2.5 text-sm text-[#1a1a2e] transition-[border-color,box-shadow,background-color] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1a1a2e] placeholder:text-[#64748b]/72 focus-visible:border-[#e74c3c]/55 focus-visible:ring-[3px] focus-visible:ring-[rgba(231,76,60,0.18)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black/[0.02] disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
