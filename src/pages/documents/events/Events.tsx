import { TableComponents } from '@/components/table/TableComponents'
import { columnEvents, dataEvents } from './events.data'

export const Events = () => {
  return (
    <div>Eventos

        <TableComponents column={columnEvents} data={dataEvents}/>
    </div>
  )
}
