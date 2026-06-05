import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors",
        {
          "bg-surface-variant text-on-surface-variant": variant === "default",
          "bg-secondary-container text-on-secondary-container": variant === "success",
          "bg-tertiary-container text-on-tertiary-container": variant === "warning",
          "bg-error-container text-on-error-container": variant === "error",
          "border border-outline-variant text-on-surface-variant": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
