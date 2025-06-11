import type React from "react"
export interface DocumentData {
  id: number
  nombre: string
  tipo: string
  contenido: string
  propietario: string
  fecha: string
  tamano: string
}

export interface ColumnDefinition {
  column: string
  label: string
  element: (item: DocumentData) => React.ReactNode
}

export interface FilterColumn {
  column: string
}
