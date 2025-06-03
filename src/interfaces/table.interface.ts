/* eslint-disable @typescript-eslint/no-explicit-any */
export interface gColumn {
    label: string;
    element: (data: any) => string;
}