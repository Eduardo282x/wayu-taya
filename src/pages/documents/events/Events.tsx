import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button';
import { HeaderPages } from '@/pages/layout/Header';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaArrowCircleDown } from "react-icons/fa";
import { eventos } from './events.data';
import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const Events = () => {
  const navigate = useNavigate();
  
  function DatePickerWithRange({className,}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  return (
      <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

  return (
    <div>
      <HeaderPages title='Eventos' Icon={FaRegCalendarAlt} />

      <Button onClick={() => navigate('formulario')} className='mb-2'>Agregar evento</Button>

      <DatePickerWithRange/>

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
