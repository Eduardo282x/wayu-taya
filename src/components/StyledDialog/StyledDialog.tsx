/* eslint-disable @typescript-eslint/no-empty-object-type */
import type * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface StyledDialogProps extends React.ComponentProps<typeof Dialog> {}

interface StyledDialogContentProps extends React.ComponentProps<typeof DialogContent> {}

interface StyledDialogTitleProps extends React.ComponentProps<typeof DialogTitle> {}

interface StyledDialogDescriptionProps extends React.ComponentProps<typeof DialogDescription> {}

function StyledDialog({ ...props }: StyledDialogProps) {
  return <Dialog {...props} />
}

function StyledDialogContent({ className, ...props }: StyledDialogContentProps) {
  return <DialogContent className={cn("manrope bg-gray-300 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500 scrollbar-width-thin scrollbar-color-gray-400", className)} {...props} />
}

function StyledDialogHeader({ ...props }: React.ComponentProps<typeof DialogHeader>) {
  return <DialogHeader {...props} />
}

function StyledDialogTitle({ className, ...props }: StyledDialogTitleProps) {
  return (
    <DialogTitle
      className={cn(
        "bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl",
        className,
      )}
      {...props}
    />
  )
}

function StyledDialogDescription({ className, ...props }: StyledDialogDescriptionProps) {
  return <DialogDescription className={cn("manrope", className)} {...props} />
}

function StyledDialogFooter({ ...props }: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter {...props} />
}

// Re-export other dialog components for convenience
const StyledDialogClose = DialogClose
const StyledDialogOverlay = DialogOverlay
const StyledDialogPortal = DialogPortal
const StyledDialogTrigger = DialogTrigger

export {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
  StyledDialogFooter,
  StyledDialogClose,
  StyledDialogOverlay,
  StyledDialogPortal,
  StyledDialogTrigger,
}
