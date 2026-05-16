import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-micro font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-electric text-white",
        secondary:
          "border-transparent bg-rule text-ink",
        terracotta:
          "border-transparent bg-terracotta-soft text-terracotta",
        correct:
          "border-transparent bg-correct-soft text-correct",
        warn:
          "border-transparent bg-warn-soft text-warn",
        wrong:
          "border-transparent bg-wrong-soft text-wrong",
        outline:
          "border-rule text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
