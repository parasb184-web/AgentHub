import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[1rem] border text-sm font-semibold tracking-tight whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[#e74c3c] bg-[#e74c3c] text-white shadow-[0_14px_35px_rgba(231,76,60,0.24)] hover:border-[#f05a48] hover:bg-[#f05a48]",
        outline:
          "border-black/10 bg-black/[0.02] text-[#1a1a2e] hover:border-[#e74c3c]/28 hover:bg-black/[0.05]",
        secondary:
          "border-black/10 bg-[rgba(0,0,0,0.02)] text-[#1a1a2e] hover:border-[#e74c3c]/25 hover:bg-black/[0.05]",
        ghost:
          "border-transparent bg-transparent text-[#64748b] hover:bg-black/[0.03] hover:text-[#1a1a2e]",
        destructive:
          "border-[#7f1d1d] bg-[#7f1d1d]/15 text-[#ffb2a7] hover:bg-[#7f1d1d]/25 focus-visible:ring-[rgba(127,29,29,0.25)]",
        link: "border-transparent bg-transparent p-0 text-[#ff8c7e] shadow-none hover:text-[#1a1a2e]",
      },
      size: {
        default:
          "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-8 gap-1.5 rounded-[0.875rem] px-3 text-xs has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[0.875rem] px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 px-6 text-sm has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11",
        "icon-xs":
          "size-8 rounded-[0.875rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[0.875rem]",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
