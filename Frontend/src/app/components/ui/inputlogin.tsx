import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "success" | "error" | "warning"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const variantStyles = {
      default: {
        border: hasValue || isFocused ? "border-teal-500" : "border-gray-300",
        ring: "focus-visible:ring-teal-500"
      },
      success: {
        border: hasValue || isFocused ? "border-green-500" : "border-gray-300",
        ring: "focus-visible:ring-green-500"
      },
      error: {
        border: "border-red-500",
        ring: "focus-visible:ring-red-500"
      },
      warning: {
        border: hasValue || isFocused ? "border-yellow-500" : "border-gray-300",
        ring: "focus-visible:ring-yellow-500"
      }
    }

    const currentVariant = variantStyles[variant]

    return (
      <input
        type={type}
        className={cn(
          // Base styles with white background
          "flex h-10 w-full rounded-md border px-3 py-2 text-base bg-white text-gray-900 transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Border styles
          currentVariant.border,
          // Placeholder
          "placeholder:text-gray-500",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          currentVariant.ring,
          // Hover styles
          "hover:border-gray-400",
          className
        )}
        ref={ref}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }