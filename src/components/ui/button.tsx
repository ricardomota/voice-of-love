import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 hover:scale-[1.02] active:scale-95 px-6 py-3 font-semibold shadow-lg hover:shadow-xl",
        destructive: "rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] active:scale-95 px-6 py-3 shadow-lg hover:shadow-xl",
        outline: "rounded-xl border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:scale-[1.01] px-6 py-3",
        secondary: "rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.01] active:scale-95 px-6 py-3 shadow-md hover:shadow-lg",
        ghost: "rounded-xl hover:bg-accent/10 hover:text-accent-foreground hover:scale-[1.01] px-4 py-2",
        link: "text-accent underline-offset-4 hover:underline rounded-lg px-2 py-1 hover:scale-[1.01]",
        glass: "floating-button parallax-slow px-6 py-3 rounded-2xl hover:scale-[1.02]",
        cta: "bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 hover:scale-[1.02] active:scale-95 px-6 py-3 font-bold shadow-lg hover:shadow-xl text-lg",
      },
      size: {
        default: "text-sm h-10",
        sm: "text-xs px-4 py-2 rounded-xl h-8",
        lg: "text-base px-8 py-4 rounded-2xl h-12",
        xl: "text-lg px-8 py-4 rounded-2xl h-14 md:h-16",
        icon: "w-10 h-10 rounded-2xl",
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
