import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Ripple } from "@/components/motion/Ripple"

const buttonVariants = {
  base: "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-btn)] text-sm font-medium transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default:
        "border border-gold text-gold bg-transparent hover:bg-gold hover:text-white",
      outline:
        "border border-foreground bg-transparent hover:bg-foreground hover:text-background text-foreground",
      ghost: "hover:bg-gray-50 hover:text-foreground",
      link: "text-gold underline-offset-4 hover:underline",
    },
    size: {
      default: "h-12 px-6 py-2 md:h-14 md:px-8",
      sm: "h-9 rounded-md px-3",
      lg: "h-14 md:h-16 px-10 text-base md:text-lg",
      icon: "h-12 w-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: keyof typeof buttonVariants.variants.variant
  size?: keyof typeof buttonVariants.variants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // 手動でバリアントとサイズをマージ
    const variantClass = buttonVariants.variants.variant[variant]
    const sizeClass = buttonVariants.variants.size[size]
    
    return (
      <Comp
        className={cn(buttonVariants.base, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      >
        <Slottable>{children}</Slottable>
        <Ripple />
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
