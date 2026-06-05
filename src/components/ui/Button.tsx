import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary text-on-primary shadow-md hover:shadow-lg hover:bg-primary/90": variant === "primary",
            "bg-secondary text-on-secondary shadow-md hover:shadow-lg hover:bg-secondary/90": variant === "secondary",
            "bg-transparent text-primary hover:bg-primary/5": variant === "tertiary",
            "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low": variant === "outline",
            "hover:bg-surface-container": variant === "ghost",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
