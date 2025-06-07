import React, { useState } from "react";
import { HeaderPages } from "@/pages/layout/Header";
import { FaPills } from "react-icons/fa";
import { medicineColumns } from "./medicine.data";
import { MedicineTable } from "./medicine.data";
import { Button } from "@/components/ui/button";
import { GiMedicines } from "react-icons/gi";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dataMedicamentos = [
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

export const Medicine = () => {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    medicineColumns.reduce((acc, col) => {
      acc[col.column] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const displayedColumns = medicineColumns.filter(
    (col) => visibleColumns[col.column]
  );

  return (
    <>
      <div>
        <HeaderPages title="Medicamentos" Icon={FaPills} />
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white text-[#5cdee5] border border-[#5cdee5] hover:bg-[#e6fafd] hover:text-[#24b3c6]"
              >
                Ver Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {medicineColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.column}
                  className="capitalize"
                  checked={visibleColumns[column.column]}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [column.column]: checked,
                    }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="search"
            placeholder="Buscar medicamentos..."
            className="w-[250px] focus:outline-0 shadow-2xl border-1 border-gray-400 bg-gray-200 rounded-xl h-[5vh] m-2 placeholder:opacity-60 py-5 px-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 200s"
          />
          <Button variant={"animated"} className="h-[90%]">
            <GiMedicines className="size-6" />
            Agregar Medicamentos
          </Button>
        </div>
      </div>
      <div>
        <MedicineTable columns={displayedColumns} data={dataMedicamentos} />
      </div>
    </>
  );
};
