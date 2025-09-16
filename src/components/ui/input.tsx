import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, maxLength, ...props }, ref) => {
    // Security: Add input validation and length limits
    const secureProps = {
      ...props,
      // Default maxLength for security (can be overridden)
      maxLength: maxLength || (type === 'email' ? 254 : type === 'password' ? 128 : 1000),
      // Prevent autocomplete for sensitive fields
      autoComplete: type === 'password' ? 'current-password' : props.autoComplete,
      // Additional security attributes
      spellCheck: type === 'password' || type === 'email' ? false : props.spellCheck,
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...secureProps}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }