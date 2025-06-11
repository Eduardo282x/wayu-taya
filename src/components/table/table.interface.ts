/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Column {
    label: string;
    column: string;
    visible: boolean;
    isIcon?: boolean;
    icon?: Icon
    element: (data: any) => string;
    className?: (data: any) => string;
}

export interface Icon {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    className?: string;
}