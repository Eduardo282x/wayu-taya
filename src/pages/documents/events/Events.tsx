import { TableComponents } from '@/components/table/TableComponents'
import { columnEvents, dataEvents } from './events.data'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button';

export const Events = () => {
  const navigate = useNavigate();
  return (
    <div>Eventos


<Button onClick={() => navigate('formulario')}>Agregar evento</Button>
        <TableComponents column={columnEvents} data={dataEvents}/>
    </div>
  )
}
