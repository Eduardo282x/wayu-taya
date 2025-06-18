import type React from "react"
export interface DocumentData {
  id: number
  nombre: string
  tipo: "png" | "docx" | "pdf"
  contenido: "personas" | "comida" | "medicina"
  propietario: string
  fecha: string
  tamano: string
  descripcion?: string
}

export interface ColumnDefinition {
  column: string
  label: string
  element: (item: DocumentData) => React.ReactNode
}
