import { useEffect, useState } from "react";
import { HeaderPages } from "@/pages/layout/Header";
import { FaFilter, FaPills } from "react-icons/fa";
import {
  medicineColumns,
} from "./medicine.data";
import { Button } from "@/components/ui/button";
import { GiMedicines } from "react-icons/gi";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MedicineForm, MedicineData } from "./MedicineForm";
import { getMedicine } from "@/services/medicine/medicine.service";
import { GroupMedicine, IMedicine } from "@/services/medicine/medicine.interface";
import { TableComponents } from "@/components/table/TableComponents";

export const Medicine = () => {

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    medicineColumns.reduce((acc, col) => {
      acc[col.column] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [medicines, setMedicines] = useState<GroupMedicine>({allMedicine: [], medicine:[]});

  useEffect(() => {
    getMedicineApi();
  }, [])

  const getMedicineApi = async () => {
    const response: IMedicine[] = await getMedicine();
    setMedicines({
      allMedicine: response,
      medicine: response
    })
  }

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const displayedColumns = medicineColumns.filter(
    (col) => visibleColumns[col.column]
  );

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const handleAddMedicineSubmit = (newMedicine: MedicineData) => {
    // setMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
    console.log(newMedicine);
    
    setIsAddFormOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  return (
    <>
      <div>
        <HeaderPages title="Medicamentos" Icon={FaPills} />
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="bg-white text-[#0350af] border border-[#0350af] hover:bg-[#e6fafd] hover:text-[#0350af]"
              >
                {/* Ver Columnas */}
                <FaFilter />
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
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            variant={"animated"}
            className="h-[90%]"
            onClick={openAddForm}
          >
            <GiMedicines className="size-6" />
            Registrar Medicamentos
          </Button>
        </div>
      </div>
      <div className="">
        <TableComponents column={displayedColumns} data={medicines.medicine} />
      </div>

      <MedicineForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={handleAddMedicineSubmit}
      />
    </>
  );
};
