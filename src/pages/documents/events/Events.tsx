import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button';
import { HeaderPages } from '@/pages/layout/Header';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaArrowCircleDown } from "react-icons/fa";
import { eventos } from './events.data';
export const Events = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeaderPages title='Eventos' Icon={FaRegCalendarAlt} />

      <Button onClick={() => navigate('formulario')} className='mb-2'>Agregar evento</Button>

      {/* <TableComponents column={columnEvents} data={dataEvents} /> */}

      <div className='spaceEvents'>
        {eventos && eventos.map(eve => (
          <div className='flex items-center justify-between w-full p-4 rounded-4xl bg-blue-500'>
            <div className='flex gap-2'>
              <div className='bg-white rounded-2xl p-1 text-center w-20 h-20'>
                <p className='bg-blue-500 text-white rounded-full px-2'>{eve.mes}</p>
                <p className='text-2xl text-blue-800 font-bold'>{eve.fecha}</p>
                <p className='text-sm'>{eve.dia}</p>
              </div>
              <div className='flex flex-col justify-between'>
                <p className='text-white text-xl'>{eve.nombre}</p>
                <p className='bg-blue-100 text-blue-500 py-1 px-3 rounded-full font-medium'>{eve.mes} {eve.fecha} a las {eve.hora}</p>
              </div>
            </div>
            <FaArrowCircleDown className='text-white text-3xl cursor-pointer' />
          </div>
        ))}
      </div>
    </div>
  )
}
