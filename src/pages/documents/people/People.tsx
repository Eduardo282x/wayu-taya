import { TableComponents } from "@/components/table/TableComponents"
import { columnPeople, dataPeople } from "./people.data"

export const People = () => {
    return (
        <div>Personas

            <TableComponents column={columnPeople} data={dataPeople}/>
        </div>
    )
}
