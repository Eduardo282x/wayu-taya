/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@/interfaces/table.interface";
import "@/styles/medicine.css";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface MedicineTableProps {
  columns: Column[];
  data: any[];
}

export const MedicineTable: React.FC<MedicineTableProps> = ({
  columns,
  data,
}) => (
  <div className="custom-table-container">
    <Table className="custom-table">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.column}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {columns.map((col) => (
              <TableCell key={col.column}>{col.element(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const medicineColumns: Column[] = [
  {
    label: "Nombre",
    column: "nombre",
    element: (data) => data.nombre,
  },
  {
    label: "Descripción",
    column: "descripcion",
    element: (data) => data.descripcion,
  },
  {
    label: "Categoría",
    column: "categoria",
    element: (data) => data.categoria,
  },
  {
    label: "Medicina",
    column: "medicina",
    element: (data) => (data.medicina ? "Sí" : "No"),
  },
  {
    label: "Unidad",
    column: "unidad",
    element: (data) => data.unidad,
  },
  {
    label: "Cantidad",
    column: "cantidad",
    element: (data) => data.cantidad,
  },
  {
    label: "Temperatura",
    column: "temperatura",
    element: (data) => data.temperatura,
  },
  {
    label: "Manufactura",
    column: "manufactura",
    element: (data) => data.manufactura,
  },
  {
    label: "Principio Activo",
    column: "principio_activo",
    element: (data) => data.principio_activo,
  },
  {
    label: "Forma",
    column: "forma",
    element: (data) => data.forma,
  },
];

export const dataMedicamentos = [
  {
    nombre: "Paracetamol",
    descripcion: "Analgésico y antipirético",
    categoria: "Analgésico",
    medicina: true,
    unidad: "Tableta",
    cantidad: 20,
    temperatura: "Ambiente",
    manufactura: "Genérico",
    principio_activo: "Paracetamol",
    forma: "Sólido",
  },
  {
    nombre: "Ibuprofeno",
    descripcion: "Antiinflamatorio no esteroideo",
    categoria: "Antiinflamatorio",
    medicina: true,
    unidad: "Cápsula",
    cantidad: 15,
    temperatura: "Ambiente",
    manufactura: "Bayer",
    principio_activo: "Ibuprofeno",
    forma: "Sólido",
  },
  {
    nombre: "Amoxicilina",
    descripcion: "Antibiótico de amplio espectro",
    categoria: "Antibiótico",
    medicina: true,
    unidad: "Tableta",
    cantidad: 10,
    temperatura: "Ambiente",
    manufactura: "Pfizer",
    principio_activo: "Amoxicilina",
    forma: "Sólido",
  },
  {
    nombre: "Loratadina",
    descripcion: "Antihistamínico para alergias",
    categoria: "Antihistamínico",
    medicina: true,
    unidad: "Tableta",
    cantidad: 30,
    temperatura: "Ambiente",
    manufactura: "Genérico",
    principio_activo: "Loratadina",
    forma: "Líquido",
  },
  {
    nombre: "Suero Oral",
    descripcion: "Solución para rehidratación oral",
    categoria: "Electrolito",
    medicina: false,
    unidad: "Botella",
    cantidad: 5,
    temperatura: "Refrigerado",
    manufactura: "Genérico",
    principio_activo: "Electrolitos",
    forma: "Líquido",
  },
];
