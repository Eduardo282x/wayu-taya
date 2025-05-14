import { TableComponents } from "@/components/table/TableComponents"
import { columnPeople, dataPeople } from "./people.data"
import { HeaderPages } from "@/pages/layout/Header"
import { PiUserList } from "react-icons/pi"

export const People = () => {
    return (
        <div>
            <HeaderPages title='Personas' Icon={PiUserList} />

            <TableComponents column={columnPeople} data={dataPeople} />
        </div>
    )
}
