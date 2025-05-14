import { TableComponents } from '@/components/table/TableComponents'
import { columnEvents, dataEvents } from './events.data'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button';
import { HeaderPages } from '@/pages/layout/Header';
import { FaRegCalendarAlt } from 'react-icons/fa';

export const Events = () => {
  const navigate = useNavigate();
  return (
    <div>
      <HeaderPages title='Eventos' Icon={FaRegCalendarAlt} />

      <Button onClick={() => navigate('formulario')}>Agregar evento</Button>
      <TableComponents column={columnEvents} data={dataEvents} />
    </div>
  )
}
