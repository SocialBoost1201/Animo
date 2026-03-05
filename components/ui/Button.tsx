import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-btn)] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02]",
  variants: {
    variant: {
      default:
        "bg-[var(--color-gold)] text-white shadow-md hover:shadow-lg",
      outline:
        "border border-foreground bg-transparent hover:bg-foreground hover:text-background",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-[var(--color-gold)] underline-offset-4 hover:underline",
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
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // 手動でバリアントとサイズをマージ
    const variantClass = buttonVariants.variants.variant[variant]
    const sizeClass = buttonVariants.variants.size[size]
    
    return (
      <Comp
        className={cn(buttonVariants.base, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
