/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Column {
    label: string;
    column: string;
    element: (data: any) => string;
}