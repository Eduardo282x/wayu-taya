/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Column {
    label: Text;
    element: (data: any) => Text;
}