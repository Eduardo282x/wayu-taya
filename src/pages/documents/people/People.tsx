import { TableComponents } from "@/components/table/TableComponents";
import { columnPeople } from "./people.data";
import { useEffect, useState } from "react";
import { HeaderPages } from "@/pages/layout/Header";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { IoPersonAddOutline } from "react-icons/io5";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FilterComponent } from "@/components/table/FilterComponent";
import { PeopleForm } from "./PeopleForm";
import { GroupPeople, IPeople, PeopleBody } from "@/services/people/people.interface";
import { getPeople, postPeopleNormal, putPeopleNormal } from "@/services/people/people.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { Column } from "@/components/table/table.interface";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";

export const People = () => {
  const [people, setPeople] = useState<GroupPeople>({ allPeople: [], people: [] });
  const [peopleSelected, setPeopleSelected] = useState<IPeople | null>(null);
  const [columns, setColumns] = useState<Column[]>(columnPeople);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getPeopleApi()
  }, [])

  const getPeopleApi = async () => {
    setLoading(true)
    try {
      const response: IPeople[] = await getPeople();
      setPeople({ allPeople: response, people: response })
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  }

  const getActionForm = async (people: PeopleBody) => {
    if (peopleSelected) {
      await putPeopleNormal(peopleSelected.id, people);
    } else {
      await postPeopleNormal(people);
    }
    getPeopleApi();
    setOpen(false);
  }

  const setPeopleFilter = (people: IPeople[]) => {
    setPeople((prev) => ({ ...prev, people: people }))
  }

  const newPeople = () => {
    setPeopleSelected(null);
    setOpen(true);
  }

  const getActionTable = (action: string, data: IPeople) => {
    setPeopleSelected(data);
    if (action == 'edit') {
      setOpen(true);
    }
  }

  return (
    <div>
      {loading && (
        <ScreenLoader />
      )}
      <HeaderPages title="Personas" Icon={BsFillPersonLinesFill} />

      <div className="flex justify-between items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <DropdownColumnFilter columns={columns} setColumns={setColumns} />

        <div className="flex items-center ">
          <FilterComponent
            data={people.allPeople}
            columns={columnPeople}
            setDataFilter={setPeopleFilter}
            placeholder="Buscar personas..."
          />
          <Button
            variant={"animated"}
            className="h-full"
            onClick={newPeople}
          >
            <IoPersonAddOutline />
            <span>Agregar persona</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <TableComponents column={columns.filter(item => item.visible == true)} data={people.people} actionTable={getActionTable} />
      </div>

      <DialogPeople open={open} setOpen={setOpen} addPeople={getActionForm} people={peopleSelected} />
    </div>
  );
};
interface DialogPeopleProps {
  open: boolean;
  setOpen: (active: boolean) => void;
  addPeople: (data: PeopleBody) => void;
  people: IPeople | null
}

const DialogPeople = ({ open, setOpen, addPeople, people }: DialogPeopleProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader className="-mb-4">
          <DialogTitle>Agregar Nueva Persona</DialogTitle>
          <DialogDescription>
            Rellena todos los campos para añadir una nueva persona.
          </DialogDescription>
        </DialogHeader>
        <PeopleForm addPeople={addPeople} people={people} />
      </DialogContent>
    </Dialog>
  )
}
