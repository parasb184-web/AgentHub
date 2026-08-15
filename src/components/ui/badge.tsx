import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:ring-ring has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[#e74c3c]/24 bg-[#e74c3c]/10 text-[#ff8c7e]",
        secondary:
          "border-black/10 bg-black/[0.03] text-[#1a1a2e]",
        destructive:
          "border-[#7f1d1d]/35 bg-[#7f1d1d]/15 text-[#ffb2a7] focus-visible:ring-[rgba(127,29,29,0.25)]",
        outline:
          "border-black/10 bg-black/[0.02] text-[#cfd3df]",
        ghost:
          "border-transparent bg-transparent text-[#64748b] hover:bg-black/[0.03] hover:text-[#1a1a2e]",
        link: "border-transparent bg-transparent px-0 text-[#ff8c7e] hover:text-[#1a1a2e]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
