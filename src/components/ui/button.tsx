import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer manrope",
  {
    variants: {
      variant: {
        normal: 'border rounded-lg text-white',
        noDefault:
          "cursor-pointer text-primary-foreground shadow-xs",
        default:
          "bg-linear-to-r from-[#024dae] to-[#5cdee5] cursor-pointer text-primary-foreground shadow-xs",
        destructive:
          "bg-destructive/85 text-white shadow-xs hover:bg-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 cursor-pointer",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        icon:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-full",
        link:
          "text-primary underline-offset-4 hover:underline",
        edit:
          "transition-all bg-blue-800 cursor-pointer text-white hover:bg-gradient-to-r from-blue-800 to-[#34A8D5] flex rounded-xl",
        delete:
          "flex justify-center items-center gap-2 bg-[#f44336] text-white hover:bg-red-600 cursor-pointer",
        animated:
          'bg-linear-to-r from-blue-800 to-[#5cdee5] cursor-pointer text-primary-foreground text-[1rem] hover:-translate-y-[0.2rem] transition-transform duration-200',
        animatedNormal:
          'cursor-pointer text-primary-foreground text-[1rem] hover:-translate-y-[0.2rem] transition-transform duration-200',
        animated_old:
          'bg-linear-to-r from-blue-800 to-[#5cdee5] cursor-pointer text-primary-foreground text-[1rem] hover:-translate-y-[0.2rem] transition-transform duration-200 drop-shadow-xl drop-shadow-[#a5b4c2] '
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
