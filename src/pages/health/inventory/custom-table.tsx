import type React from "react"
import "./custom-table.css"

interface Column {
  header: string
  key: string
  className?: string
}

interface CustomTableProps {
  columns: Column[]
  children: React.ReactNode
  className?: string
}

// Usar TrHTMLAttributes en lugar de HTMLAttributes para filas
interface CustomTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

// Usar TdHTMLAttributes en lugar de HTMLAttributes para celdas
interface CustomTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

// Usar ThHTMLAttributes para encabezados
interface CustomTableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode
}

// Usar TableSectionHTMLAttributes para secciones de tabla
interface CustomTableHeaderProps extends React.TableHTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export const CustomTable: React.FC<CustomTableProps> = ({ columns, children, className = "" }) => {
  return (
    <div className="custom-table-container">
      <table className={`custom-table ${className}`}>
        <thead className="bg-gradient-to-r from-blue-800 to-[#34A8D5] pointer-events-none">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export const CustomTableRow: React.FC<CustomTableRowProps> = ({ children, className = "", ...props }) => {
  return (
    <tr className={className || ""} {...props}>
      {children}
    </tr>
  )
}

export const CustomTableCell: React.FC<CustomTableCellProps> = ({ children, className = "", ...props }) => {
  return (
    <td className={className || ""} {...props}>
      {children}
    </td>
  )
}

export const CustomTableHeader: React.FC<CustomTableHeaderProps> = ({ children, className = "", ...props }) => {
  return (
    <thead className={`bg-gradient-to-r from-blue-800 to-[#34A8D5] pointer-events-none ${className || ""}`} {...props}>
      {children}
    </thead>
  )
}

export const CustomTableHeaderCell: React.FC<CustomTableHeaderCellProps> = ({ children, className = "", ...props }) => {
  return (
    <th className={className || ""} {...props}>
      {children}
    </th>
  )
}
