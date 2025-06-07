import { Column } from "@/interfaces/table.interface";
import "@/styles/medicine.css"; // Asegúrate de que este CSS esté correctamente configurado
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface MedicineTableProps {
  columns: Column[]; // Las columnas que se recibirán ya estarán filtradas
  data: any[];
}

export const MedicineTable: React.FC<MedicineTableProps> = ({
  columns,
  data,
}) => (
  <div className="custom-table-container">
    {" "}
    {/* Contenedor para la sombra y bordes redondeados */}
    <Table className="custom-table">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            // `key` para cada `TableHead`
            <TableHead key={col.column}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {columns.map((col) => (
              // `key` para cada `TableCell`
              <TableCell key={col.column}>{col.element(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Estas son tus definiciones de columnas completas.
// `Medicine.tsx` se encargará de filtrarlas antes de pasarlas a MedicineTable.
export const medicineColumns: Column[] = [
  {
    label: "Nombre", // text
    column: "nombre",
    element: (data) => data.nombre,
  },
  {
    label: "Descripción", // text
    column: "descripcion",
    element: (data) => data.descripcion,
  },
  {
    label: "Categoría", // selector
    column: "categoria",
    element: (data) => data.categoria,
  },
  {
    label: "Medicina", // booleano
    column: "medicina",
    element: (data) => (data.medicina ? "Sí" : "No"),
  },
  {
    label: "Unidad", // selector
    column: "unidad",
    element: (data) => data.unidad,
  },
  {
    label: "Cantidad", // text/numero
    column: "cantidad",
    element: (data) => data.cantidad,
  },
  {
    label: "Temperatura", // text
    column: "temperatura",
    element: (data) => data.temperatura,
  },
  {
    label: "Manufactura", // text
    column: "manufactura",
    element: (data) => data.manufactura,
  },
  {
    label: "Principio Activo", // text
    column: "principio_activo",
    element: (data) => data.principio_activo,
  },
  {
    label: "Forma", // selector
    column: "forma",
    element: (data) => data.forma,
  },
];
