import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Define la interfaz People que representa la estructura de los datos de cada persona en la tabla.
export interface People {
  name: text; // Propiedad para el nombre de la persona.
  lastname: text; // Propiedad para el apellido de la persona.
  address: text; // Propiedad para la dirección de la persona.
  phone: string; // Propiedad para el número de teléfono de la persona.
  dni: string; // Propiedad para el documento de identidad (cédula) de la persona.
}
