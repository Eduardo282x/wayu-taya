/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Column {
    label: string;
    element: (data: any) => string;
    icon?: boolean
    
}