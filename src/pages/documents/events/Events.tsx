import { Button } from "@/components/ui/button"
import { HeaderPages } from "@/pages/layout/Header"
import { FaRegCalendarAlt } from "react-icons/fa"
import { FaArrowCircleDown } from "react-icons/fa"
import { formatTimeRange } from "./events.data"
import { FaRegCircleCheck } from "react-icons/fa6"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventForm } from "./EventForm"
import { useEffect, useState } from "react"
import { DatePickerRange } from "@/components/datePickerRange/DatePickerRange"
import { getEvents, postEvents, putEvents } from "@/services/events/events.service"
import type { EventsBody, GroupEvents, IEvents } from "@/services/events/events.interface"
import { days, months } from "@/utils/formatters"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Trash2 } from "lucide-react"
import { IProviders } from "@/services/provider/provider.interface"
import { getProviders } from "@/services/provider/provider.service"

export const Events = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [events, setEvents] = useState<GroupEvents>({ allEvents: [], events: [] })
  // const [localEvents, setLocalEvents] = useState<LocalEvent[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<IEvents | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [providers, setProviders] = useState<IProviders[]>([]);


  useEffect(() => {
    getEventsApi();
    getProvidersApi();
  }, [])

  const getProvidersApi = async () => {
    try {
      const response: IProviders[] = await getProviders()
      setProviders(response)
    } catch (err) {
      console.log(err)
    }
  }

  const getEventsApi = async () => {
    setLoading(true)
    try {
      const response: IEvents[] = await getEvents()
      setEvents({ allEvents: response, events: response })
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const newEvent = () => {
    setIsEditing(false);
    setSelectedEvent(null);
    setOpen(true);
  }

  const openDialog = (event: IEvents) => {
    if (event) {
      setSelectedEvent(event)
      setIsEditing(true)
    } else {
      setSelectedEvent(null)
      setIsEditing(false)
    }
    setOpen(true)
  }

  const handleEventSaved = async (newEvent: EventsBody) => {
    const startDateTime = `${newEvent.startDate.toString().split('T')[0]}T${newEvent.startTime}:00.000Z`
    const endDateTime = `${newEvent.startDate.toString().split('T')[0]}T${newEvent.endTime}:00.000Z`

    const parseDataEvent: EventsBody = {
      ...newEvent,
      startDate: startDateTime,
      endDate: endDateTime,
    }

    if (isEditing) {
      await putEvents(Number(selectedEvent?.id), parseDataEvent)
    } else {
      await postEvents(parseDataEvent)
    }
    setOpen(false);
    await getEventsApi();
  }

  const handleDeleteEvent = (eventId: number) => {
    console.log(eventId);

    // setLocalEvents((prev: LocalEvent[]) => prev.filter((event: LocalEvent) => event.id !== eventId))
  }

  return (
    <div>
      {loading && <ScreenLoader />}
      <HeaderPages title="Eventos" Icon={FaRegCalendarAlt} />
      <div className="flex justify-between p-4">
        <DatePickerRange />
        <Button onClick={newEvent} className="bg-blue-600 hover:bg-blue-700">
          <FaRegCircleCheck /> Agendar evento
        </Button>
      </div>

      <div className="flex flex-col gap-3 h-[30rem] overflow-y-auto">
        {events.events.map((eve: IEvents, index: number) => (
          <CardEvents event={eve} key={`event-${eve.id}-${index}`} onEdit={openDialog} onDelete={handleDeleteEvent} />
        ))}

        {/* {/* {eventos && eventos.map((eve: NewEvents, index: number) => <CardEventsBase event={eve} key={`static-${index}`} />)} *} */}

      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-blue-700 text-xl">
              {isEditing ? "Editar evento" : "Crear nuevo evento"}
            </DialogTitle>
            <DialogDescription className="text-blue-600 text-sm -mt-2">Completa la información del evento</DialogDescription>
          </DialogHeader>

          <EventForm
            selectedEvent={selectedEvent}
            isEditing={isEditing}
            providers={providers}
            onClose={() => setOpen(false)}
            onEventSaved={handleEventSaved}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CardEventsProps {
  event: IEvents
  onEdit: (event: IEvents) => void
  onDelete: (eventId: number) => void
}

const CardEvents = ({ event, onEdit, onDelete }: CardEventsProps) => {
  const date = new Date(event.startDate)
  const [open, setOpen] = useState<boolean>(false);

  const getDate = (): string => {
    return date.getDate().toString().padStart(2, "0")
  }
  const getDay = (): string => {
    return days[date.getDay()]
  }
  const getMonth = (type: string): string => {
    if (type == "short") {
      return months[date.getMonth()].slice(0, 3)
    } else {
      return months[date.getMonth()]
    }
  }

  const handleDelete = () => {
    onDelete(event.id)
  }

  // Formatear el rango de tiempo con AM/PM
  const formattedTimeRange = formatTimeRange(event.startDate.toString() || "08:00", event.endDate.toString() || "11:00")

  return (
    <div className="w-full rounded-2xl bg-blue-600">
      <div onClick={() => setOpen(!open)} className="flex items-center justify-between w-full p-4 cursor-pointer">
        <div className="flex gap-2">
          <div className="bg-white rounded-2xl p-1 text-center w-20 h-20">
            <p className="bg-blue-600 text-white rounded-full px-2 text-xs">{getMonth("short")}</p>
            <p className="text-2xl text-blue-700 font-bold">{getDate()}</p>
            <p className="text-xs text-blue-500">{getDay()}</p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-white text-xl">{event.name}</p>
            <p className="bg-blue-200 text-blue-700 py-1 px-3 rounded-full font-medium text-sm">
              {getMonth("")} {getDate()} • {formattedTimeRange}
            </p>
          </div>
        </div>
        <FaArrowCircleDown
          className={`text-white text-3xl transition-all duration-500 ease-out transform hover:scale-110 ${open ? "rotate-180 scale-105" : "rotate-0 scale-100"
            }`}
        />
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-blue-500 mt-2 pt-4 animate-in slide-in-from-top-4 fade-in duration-500 ease-out">
          <div className="bg-blue-500 rounded-xl p-4 text-white transform transition-all duration-300 ease-out animate-in zoom-in-95">
            <h3 className="font-bold text-lg mb-3">Detalles del Evento</h3>
            <div className="space-y-2 text-sm ">
              <div>
                <span className="font-semibold">Nombre:</span> {event.name}
              </div>
              <div>
                <span className="font-semibold">Fecha:</span> {getMonth("")} {getDate()}, {date.getFullYear()}
              </div>
              <div>
                <span className="font-semibold">Hora:</span> {formattedTimeRange}
              </div>
              <div>
                <span className="font-semibold">Ubicación:</span> {event.address}
              </div>
              {event.providersEvents && event.providersEvents.length > 0 && (
                <div className="flex gap-2 items-start">
                  <span className="font-semibold">Proveedores:</span>
                  <div className="flex flex-wrap gap-1">
                    {event.providersEvents && event.providersEvents.map((provider, index: number) => (
                      <span
                        key={index}
                        className="bg-white text-blue-600 border border-white text-xs px-2 py-1 rounded-full"
                      >
                        {provider.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="text-blue-600 border-white hover:bg-white hover:scale-105 transition-all duration-300 ease-out transform"
                onClick={() => { onEdit(event) }}
              >
                Editar Evento
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="text-red-600 border-white hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-300 ease-out transform"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// interface CardEventsBaseProps {
//   event: NewEvents
// }

// const CardEventsBase = ({ event }: CardEventsBaseProps) => {
//   const [open, setOpen] = useState<boolean>(false)

//   return (
//     <div className="w-full rounded-2xl bg-blue-600">
//       <div onClick={() => setOpen(!open)} className="flex items-center justify-between w-full p-4 cursor-pointer">
//         <div className="flex gap-2">
//           <div className="bg-white rounded-2xl p-1 text-center w-20 h-20">
//             <p className="bg-blue-600 text-white rounded-full px-2 text-xs">{event.mes}</p>
//             <p className="text-2xl text-blue-700 font-bold">{event.fecha}</p>
//             <p className="text-xs text-blue-500">{event.dia}</p>
//           </div>
//           <div className="flex flex-col justify-between">
//             <p className="text-white text-xl">{event.nombre}</p>
//             <p className="bg-blue-200 text-blue-700 py-1 px-3 rounded-full font-medium text-sm">
//               {event.mes} {event.fecha} • {event.hora}
//             </p>
//           </div>
//         </div>
//         <FaArrowCircleDown
//           className={`text-white text-3xl transition-all duration-500 ease-out transform hover:scale-110 ${open ? "rotate-180 scale-105" : "rotate-0 scale-100"
//             }`}
//         />
//       </div>

//       {open && (
//         <div className="px-4 pb-4 border-t border-blue-500 mt-2 pt-4 animate-in slide-in-from-top-4 fade-in duration-500 ease-out">
//           <div className="bg-blue-500 rounded-xl p-4 text-white transform transition-all duration-300 ease-out animate-in zoom-in-95">
//             <h3 className="font-bold text-lg mb-3">Detalles del Evento</h3>
//             <div className="space-y-2 text-sm">
//               <div>
//                 <span className="font-semibold">Nombre:</span> {event.nombre}
//               </div>
//               <div>
//                 <span className="font-semibold">Fecha:</span> {event.mes} {event.fecha}
//               </div>
//               <div>
//                 <span className="font-semibold">Hora:</span> {event.hora}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }