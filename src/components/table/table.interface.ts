import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Column {
    label: string;
    column: string;
    visible: boolean;
    isIcon?: boolean;
    icon?: Icon;
    element: (data: any) => string | React.ReactNode;
    hiddenIcon?: (data: any) => boolean;
    className?: (data: any) => string;
    disabledClassName?: boolean;
}

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface Icon {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    className?: string;
    variant: ButtonVariant;
}