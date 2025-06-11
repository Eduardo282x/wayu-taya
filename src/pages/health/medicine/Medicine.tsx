import { GroupMedicine, IMedicine } from "@/services/medicine/medicine.interface";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";
import { TableComponents } from "@/components/table/TableComponents";
import { FilterComponent } from "@/components/table/FilterComponent";
import { getMedicine } from "@/services/medicine/medicine.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { Column } from "@/components/table/table.interface";
import { MedicineForm, MedicineData } from "./MedicineForm";
import { HeaderPages } from "@/pages/layout/Header";
import { medicineColumns } from "./medicine.data";
import { Button } from "@/components/ui/button";
import { GiMedicines } from "react-icons/gi";
import { useEffect, useState } from "react";
import { FaPills } from "react-icons/fa";

export const Medicine = () => {
  const [medicines, setMedicines] = useState<GroupMedicine>({ allMedicine: [], medicine: [] });
  const [columns, setColumns] = useState<Column[]>(medicineColumns);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getMedicineApi();
  }, [])

  const getMedicineApi = async () => {
    setLoading(true);
    try {
      const response: IMedicine[] = await getMedicine();
      setMedicines({ allMedicine: response, medicine: response })
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const handleAddMedicineSubmit = (newMedicine: MedicineData) => {
    // setMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
    console.log(newMedicine);
    setIsAddFormOpen(false);
  };

  const setMedicineFilter = (medicines: IMedicine[]) => {
    setMedicines((prev) => ({ ...prev, medicine: medicines }));
  };

  const getActionTable = (action: string, data: IMedicine) => {
    console.log(action);
    console.log(data);
    // setUserSelected(data);
    if (action == 'edit') {
      setIsAddFormOpen(true);
    }
    // if (action == 'delete') {
    //   setIsDeleteDialogOpen(true);
    // }
  }

  return (
    <>
      {loading && (
        <ScreenLoader />
      )}
      <div>
        <HeaderPages title="Medicamentos" Icon={FaPills} />
      </div>

      <div className="flex justify-between items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <DropdownColumnFilter columns={columns} setColumns={setColumns} />

        <div className="flex items-center ">
          <FilterComponent
            data={medicines.allMedicine}
            columns={medicineColumns}
            placeholder="Buscar medicamentos..."
            setDataFilter={setMedicineFilter}
          />
          <Button
            variant={"animated"}
            className="h-full"
            onClick={openAddForm}
          >
            <GiMedicines className="size-6" />
            Registrar Medicamentos
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents
          column={columns.filter(item => item.visible == true)}
          data={medicines.medicine}
          actionTable={getActionTable}
        />
      </div>

      <MedicineForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={handleAddMedicineSubmit}
      />
    </>
  );
};
