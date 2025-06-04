import { TableComponents } from "@/components/table/TableComponents";
import { columnPeople } from "./people.data";
import { useEffect, useState } from "react";
import { HeaderPages } from "@/pages/layout/Header";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { IoPersonAddOutline } from "react-icons/io5";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, } from "@/components/ui/dialog";
import { FilterComponent } from "@/components/table/FilterComponent";
import { PeopleForm } from "./PeopleForm";
import { GroupPeople, IPeople } from "@/services/people/people.interface";
import { getPeople } from "@/services/people/people";

export const People = () => {
  const [people, setPeople] = useState<GroupPeople>({ allPeople: [], people: [] });
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getPeopleApi()
  }, [])

  const getPeopleApi = async () => {
    const response: IPeople[] = await getPeople();
    setPeople({
      allPeople: response,
      people: response
    })
  }

  const setPeopleFilter = (users: IPeople[]) => {
    setPeople((prev) => ({ ...prev, people: users }))
  }

  return (
    <div>
      <HeaderPages title="Personas" Icon={BsFillPersonLinesFill} />
      <div className="flex justify-end gap-2 mb-2">
        <FilterComponent data={people.allPeople} columns={columnPeople} setDataFilter={setPeopleFilter} />
        <Button onClick={() => setOpen(true)} className="flex items-center mb-2 gap-2">
          <IoPersonAddOutline />
          <span>Agregar persona</span>
        </Button>
      </div>
      <div>
        <TableComponents column={columnPeople} data={people.people} />
      </div>
      <DialogPeople open={open} setOpen={setOpen} />
    </div>
  );
};
interface DialogPeopleProps {
  open: boolean
  setOpen: (active: boolean) => void
}

const DialogPeople = ({ open, setOpen }: DialogPeopleProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Persona</DialogTitle>
          <DialogDescription>
            Rellena todos los campos para añadir una nueva persona.
          </DialogDescription>
        </DialogHeader>
        <PeopleForm />
        <DialogFooter>
          <Button type="submit">Guardar</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
