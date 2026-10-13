import { z } from "zod";

/**
 * Esquema canonico de las filas de carga masiva (correccion 46).
 *
 * Es la fuente unica de reglas para donaciones y medicinas: el cliente valida
 * con el y el backend usa el mismo contrato (copiar este archivo). Evita que
 * una fila sea aceptada en el navegador y rechazada en el servidor.
 *
 * Opera sobre los strings crudos de la plantilla (sin transformar), porque la
 * UI muestra el valor original y hace la conversion numerica aparte.
 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const isPositiveInteger = (value: string): boolean => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && Number.isInteger(parsed) && parsed > 0;
};

const isValidDateOnly = (value: string): boolean =>
    !value || (DATE_ONLY.test(value) && !Number.isNaN(new Date(value).getTime()));

export const donationImportRowSchema = z.object({
    medicina: z
        .string()
        .trim()
        .min(1, { message: "La medicina es obligatoria." }),
    cantidad: z
        .string()
        .trim()
        .min(1, { message: "La cantidad es obligatoria." })
        .refine(isPositiveInteger, {
            message: "La cantidad debe ser un número entero mayor a 0.",
        }),
    lote: z.string().trim(),
    fechaExpiracion: z
        .string()
        .trim()
        .refine(isValidDateOnly, {
            message: "La fecha de expiración no es válida.",
        }),
});

export type DonationImportRow = z.infer<typeof donationImportRowSchema>;

/**
 * Fila de la plantilla de medicinas. El frontend hoy no parsea este Excel (lo
 * valida el backend), pero el contrato queda definido aqui para compartirlo.
 */
export const medicineImportRowSchema = z.object({
    codigo: z.string().trim().optional().default(""),
    nombre: z
        .string()
        .trim()
        .min(1, { message: "El nombre es obligatorio." }),
    presentacion: z
        .string()
        .trim()
        .min(1, { message: "La presentación es obligatoria." }),
    categoria: z.string().trim().optional().default(""),
    cantidad: z
        .string()
        .trim()
        .min(1, { message: "La cantidad es obligatoria." })
        .refine(isPositiveInteger, {
            message: "La cantidad debe ser un número entero mayor a 0.",
        }),
    lote: z.string().trim().optional().default(""),
    fechaExpiracion: z
        .string()
        .trim()
        .optional()
        .default("")
        .refine(isValidDateOnly, {
            message: "La fecha de expiración no es válida.",
        }),
});

export type MedicineImportRow = z.infer<typeof medicineImportRowSchema>;
