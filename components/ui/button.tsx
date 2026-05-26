import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(49,95,134,0.18)] active:shadow-[0_0_0_3px_rgba(49,95,134,0.22)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-electric text-bg shadow-soft hover:-translate-y-0.5 hover:shadow-medium active:translate-y-0",
        destructive:
          "bg-wrong text-bg shadow-soft hover:bg-wrong/90 hover:shadow-medium",
        outline:
          "border border-rule bg-bg-elevated text-ink shadow-[0_1px_1px_rgba(32,32,30,0.03)] hover:border-electric/40 hover:bg-electric-soft/35",
        secondary:
          "bg-surface-subtle text-ink hover:bg-rule/80",
        ghost:
          "text-ink hover:bg-surface-subtle",
        link:
          "text-electric underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-9 rounded-xl px-4 py-2.5",
        lg: "h-11 rounded-2xl px-6 py-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
