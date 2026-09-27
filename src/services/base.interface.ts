export interface BaseResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

/**
 * `data` de un error de autenticacion o de negocio (401, 403, 404, 400 manual).
 * El backend lo construye a partir del cuerpo de la excepcion, por eso
 * 401 trae { message, error, statusCode } y no solo `message`.
 */
export interface ApiErrorDetail {
    message?: string;
    error?: string;
    statusCode?: number;
    detail?: string;
}

/**
 * `data` de un 400 de validacion. El backend devuelve UN detalle por campo con
 * `messages` como ARREGLO de strings (no un string suelto).
 */
export interface ValidationFieldError {
    field: string;
    messages: string[] | string;
}

export interface ApiValidationError {
    message?: string;
    errors?: ValidationFieldError[];
    statusCode?: number;
}

/**
 * `data` en un error NO siempre es null: solo lo es en los errores internos de
 * base de datos. Leerlo siempre.
 */
export type ApiErrorData = ApiErrorDetail | ApiValidationError | null;

export interface DateRangeFilter {
    startDate: string | Date;
    endDate: string | Date;
}

export interface Pagination {
    page: number;
    size: number;
    startDate?: string | Date;
    endDate?: string | Date;
}

export interface PaginationQuery {
    page: number;
    size: number;
}
