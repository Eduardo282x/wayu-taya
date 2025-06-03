import { Button } from '@/components/ui/button';
import { HeaderPages } from '@/pages/layout/Header';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaArrowCircleDown } from "react-icons/fa";
import { eventos, NewEvents } from './events.data';
import { FaRegCircleCheck } from "react-icons/fa6";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { useEffect, useState } from 'react';
import { DatePickerRange } from '@/components/datePickerRange/DatePickerRange';
import { getEvents } from '@/services/events/events';
import { GroupEvents, IEvents } from '@/services/events/events.interface';
import { days, months } from '@/utils/formatters';

export const Events = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<GroupEvents>({ allEvents: [], events: [] });

  useEffect(() => {
    getEventsApi()
  }, [])

  const getEventsApi = async () => {
    const response: IEvents[] = await getEvents();
    setEvents({ allEvents: response, events: response })
  }

  return (
    <div>
      <HeaderPages title='Eventos' Icon={FaRegCalendarAlt} />
      <div className='flex justify-between p-4'>
        <DatePickerRange />
        <Button onClick={() => setOpen(true)}><FaRegCircleCheck /> Agendar evento </Button>
      </div>

      <div className='flex flex-col gap-3 h-[27rem] overflow-y-auto'>
        {events.events && events.events.map((eve: IEvents, index: number) => (
          <CardEvents event={eve} key={index} />
        ))}
        {eventos && eventos.map((eve: NewEvents, index: number) => (
          <CardEventsBase event={eve} key={index} />
        ))}
      </div>

      <DialogEvents open={open} setOpen={setOpen} />
    </div>
  )
}

interface CardEventsProps {
  event: IEvents
}

const CardEvents = ({ event }: CardEventsProps) => {
  const date = new Date(event.date);
  const [open, setOpen] = useState<boolean>(false);

  const getDate = (): string => {
    return date.getDate().toString().padStart(2, '0')
  }
  const getDay = (): string => {
    return days[date.getDay()]
  }
  const getMonth = (type: string): string => {
    if (type == 'short') {
      return months[date.getMonth()].slice(0, 3)
    } else {
      return months[date.getMonth()]
    }
  }

  return (
    <div onClick={() => setOpen(!open)} className='flex items-center justify-between w-full p-4 rounded-2xl bg-blue-500 cursor-pointer'>
      <div className='flex gap-2'>
        <div className='bg-white rounded-2xl p-1 text-center w-20 h-20'>
          <p className='bg-blue-500 text-white rounded-full px-2'>{getMonth('short')}</p>
          <p className='text-2xl text-blue-800 font-bold'>{getDate()}</p>
          <p className='text-sm'>{getDay()}</p>
        </div>
        <div className='flex flex-col justify-between'>
          <p className='text-white text-xl'>{event.name}</p>
          <p className='bg-blue-100 text-blue-500 py-1 px-3 rounded-full font-medium'>{getMonth('')} {getDate()} a las 8:00am</p>
        </div>
      </div>
      <FaArrowCircleDown className={`text-white text-3xl ${open ? 'rotate-180' : 'rotate-0'} transition-all ease-in-out`} />
    </div>
  )
}

interface CardEventsBaseProps {
  event: NewEvents
}

const CardEventsBase = ({ event }: CardEventsBaseProps) => {
  return (
    <div className='flex items-center justify-between w-full p-4 rounded-2xl bg-blue-500'>
      <div className='flex gap-2'>
        <div className='bg-white rounded-2xl p-1 text-center w-20 h-20'>
          <p className='bg-blue-500 text-white rounded-full px-2'>{event.mes}</p>
          <p className='text-2xl text-blue-800 font-bold'>{event.fecha}</p>
          <p className='text-sm'>{event.dia}</p>
        </div>
        <div className='flex flex-col justify-between'>
          <p className='text-white text-xl'>{event.nombre}</p>
          <p className='bg-blue-100 text-blue-500 py-1 px-3 rounded-full font-medium'>{event.mes} {event.fecha} a las {event.hora}</p>
        </div>
      </div>
      <FaArrowCircleDown className='text-white text-3xl cursor-pointer' />
    </div>
  )
}

interface DialogEventsProps {
  open: boolean
  setOpen: (active: boolean) => void
}

const DialogEvents = ({ open, setOpen }: DialogEventsProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-xs rounded-[20px] p-4 bg-[#3b7ac9] border border-[#2e5ea8] text-white font-sans">
        <DialogHeader>
          <DialogTitle>Editar evento</DialogTitle>
          <DialogDescription className="text-white text-xs mb-4">
            A continuación introduce la información del evento
          </DialogDescription>
        </DialogHeader>

        <EventForm />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className='text-black'>Cancelar</Button>
          </DialogClose>
          <Button type="submit">Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}