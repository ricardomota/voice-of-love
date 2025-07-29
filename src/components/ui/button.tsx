import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "ios-button",
        destructive: "rounded-2xl bg-destructive text-destructive-foreground hover:scale-105 active:scale-95 px-6 py-3",
        outline: "ios-button-secondary",
        secondary: "rounded-2xl bg-secondary/60 text-secondary-foreground hover:bg-secondary/80 backdrop-blur-lg border border-white/20 px-6 py-3",
        ghost: "rounded-xl hover:bg-white/40 backdrop-blur-sm px-4 py-2",
        link: "text-accent underline-offset-4 hover:underline rounded-lg px-2 py-1",
        glass: "floating-button parallax-slow px-6 py-3 rounded-2xl",
      },
      size: {
        default: "text-sm",
        sm: "text-xs px-4 py-2 rounded-xl",
        lg: "text-base px-8 py-4 rounded-2xl",
        icon: "w-11 h-11 rounded-2xl",
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
