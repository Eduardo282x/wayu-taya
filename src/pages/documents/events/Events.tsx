import { Button } from "@/components/ui/button"
import { HeaderPages } from "@/pages/layout/Header"
import { FaRegCalendarAlt } from "react-icons/fa"
import { FaArrowCircleDown } from "react-icons/fa"
import { eventos, type NewEvents } from "./events.data"
import { FaRegCircleCheck } from "react-icons/fa6"
import { FaTrash } from "react-icons/fa"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventForm } from "./EventForm"
import { useEffect, useState } from "react"
import { DatePickerRange } from "@/components/datePickerRange/DatePickerRange"
import { getEvents } from "@/services/events/events.service"
import type { GroupEvents, IEvents } from "@/services/events/events.interface"
import { days, months } from "@/utils/formatters"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"

interface LocalEvent {
  id: string
  name: string
  date: string
  location?: string
  contact?: string
  startTime?: string
  endTime?: string
}

const formatTimeToAMPM = (time: string): string => {
  if (!time) return "8:00am"

  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "pm" : "am"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minutes}${ampm}`
}

export const Events = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [events, setEvents] = useState<GroupEvents>({ allEvents: [], events: [] })
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]) // Eventos creados localmente
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<LocalEvent | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    getEventsApi()
  }, [])

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

  const openDialog = (event?: LocalEvent) => {
    if (event) {
      setSelectedEvent(event)
      setIsEditing(true)
    } else {
      setSelectedEvent(null)
      setIsEditing(false)
    }
    setOpen(true)
  }

  const handleEventSaved = (newEvent: LocalEvent) => {
    if (isEditing && selectedEvent) {
      setLocalEvents((prev: LocalEvent[]) =>
        prev.map((event: LocalEvent) =>
          event.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : event,
        ),
      )
    } else {
      const eventWithId: LocalEvent = {
        ...newEvent,
        id: Date.now().toString(),
      }
      setLocalEvents((prev: LocalEvent[]) => [...prev, eventWithId])
    }
    setOpen(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      setLocalEvents((prev: LocalEvent[]) => prev.filter((event) => event.id !== eventId))
    }
  }

  const apiEventsAsLocal: LocalEvent[] = events.events.map((event: IEvents, index: number) => ({
    id: event.id?.toString() || `api-event-${index}`,
    name: event.name || "",
    date: event.date.toISOString() || new Date().toISOString(),
    location: "",
    contact: "",
    startTime: "08:00",
    endTime: "11:00",
  }))

  const allEvents = [...apiEventsAsLocal, ...localEvents]

  return (
    <div>
      {loading && <ScreenLoader />}
      <HeaderPages title="Eventos" Icon={FaRegCalendarAlt} />
      <div className="flex justify-between p-4">
        <DatePickerRange />
        <Button onClick={() => openDialog()}>
          <FaRegCircleCheck /> Agendar evento
        </Button>
      </div>

      <div className="flex flex-col gap-3 h-[27rem] overflow-y-auto">
        {allEvents.map((eve: LocalEvent, index: number) => (
          <CardEvents event={eve} key={`event-${eve.id}-${index}`} onEdit={openDialog} onDelete={handleDeleteEvent} />
        ))}
        {eventos &&
          eventos.map((eve: NewEvents, index: number) => <CardEventsBase event={eve} key={`static-${index}`} />)}
      </div>

      <DialogEvents
        open={open}
        setOpen={setOpen}
        selectedEvent={selectedEvent}
        isEditing={isEditing}
        onEventSaved={handleEventSaved}
      />
    </div>
  )
}

interface CardEventsProps {
  event: LocalEvent
  onEdit: (event: LocalEvent) => void
  onDelete: (eventId: string) => void
}

const CardEvents = ({ event, onEdit, onDelete }: CardEventsProps) => {
  const date = new Date(event.date)
  const [open, setOpen] = useState<boolean>(false)

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

  return (
    <div className="w-full rounded-2xl bg-blue-500">
      <div onClick={() => setOpen(!open)} className="flex items-center justify-between w-full p-4 cursor-pointer">
        <div className="flex gap-2">
          <div className="bg-white rounded-2xl p-1 text-center w-20 h-20">
            <p className="bg-blue-500 text-white rounded-full px-2 text-xs">{getMonth("short")}</p>
            <p className="text-2xl text-blue-800 font-bold">{getDate()}</p>
            <p className="text-xs text-blue-600">{getDay()}</p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-white text-xl">{event.name}</p>
            <p className="bg-blue-100 text-blue-500 py-1 px-3 rounded-full font-medium text-sm">
              {getMonth("")} {getDate()} • {formatTimeToAMPM(event.startTime || "08:00")} -{" "}
              {formatTimeToAMPM(event.endTime || "11:00")}
            </p>
          </div>
        </div>
        <FaArrowCircleDown
          className={`text-white text-3xl ${open ? "rotate-180" : "rotate-0"} transition-all ease-in-out`}
        />
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-blue-400 mt-2 pt-4">
          <div className="bg-blue-400 rounded-xl p-4 text-white">
            <h3 className="font-bold text-lg mb-3">Detalles del Evento</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Nombre:</span> {event.name}
              </div>
              <div>
                <span className="font-semibold">Fecha:</span> {getMonth("")} {getDate()}, {date.getFullYear()}
              </div>
              <div>
                <span className="font-semibold">Hora:</span> {formatTimeToAMPM(event.startTime || "08:00")} -{" "}
                {formatTimeToAMPM(event.endTime || "11:00")}
              </div>
              {event.location && (
                <div>
                  <span className="font-semibold">Ubicación:</span> {event.location}
                </div>
              )}
              {event.contact && (
                <div>
                  <span className="font-semibold">Contacto:</span> {event.contact}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-white hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(event)
                }}
              >
                Editar Evento
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-white hover:bg-red-50 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(event.id)
                }}
              >
                <FaTrash className="w-3 h-3 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface CardEventsBaseProps {
  event: NewEvents
}

const CardEventsBase = ({ event }: CardEventsBaseProps) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    // <div className={`w-full rounded-2xl bg-blue-500 h-80 overflow-hidden interpolate ease-in-out delay-100 duration-150 transition-all`}>
    <div className={`w-full rounded-2xl bg-blue-500`}>
      <div onClick={() => setOpen(!open)} className="flex items-center justify-between w-full p-4 cursor-pointer">
        <div className="flex gap-2">
          <div className="bg-white rounded-2xl p-1 text-center w-20 h-20">
            <p className="bg-blue-500 text-white rounded-full px-2 text-xs">{event.mes}</p>
            <p className="text-2xl text-blue-800 font-bold">{event.fecha}</p>
            <p className="text-xs text-blue-600">{event.dia}</p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-white text-xl">{event.nombre}</p>
            <p className="bg-blue-100 text-blue-500 py-1 px-3 rounded-full font-medium text-sm">
              {event.mes} {event.fecha} • {event.hora}
            </p>
          </div>
        </div>
        <FaArrowCircleDown
          className={`text-white text-3xl ${open ? "rotate-180" : "rotate-0"} transition-all ease-in-out`}
        />
      </div>

      {open && (
        <div className={` px-4 pb-4 border-t border-blue-400 mt-2 pt-4`}>
          <div className="bg-blue-400 rounded-xl p-4 text-white">
            <h3 className="font-bold text-lg mb-3">Detalles del Evento</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Nombre:</span> {event.nombre}
              </div>
              <div>
                <span className="font-semibold">Fecha:</span> {event.mes} {event.fecha}
              </div>
              <div>
                <span className="font-semibold">Hora:</span> {event.hora}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface DialogEventsProps {
  open: boolean
  setOpen: (active: boolean) => void
  selectedEvent: LocalEvent | null
  isEditing: boolean
  onEventSaved: (event: LocalEvent) => void
}

const DialogEvents = ({ open, setOpen, selectedEvent, isEditing, onEventSaved }: DialogEventsProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md rounded-xl p-6 bg-blue-100 border border-slate-300 text-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-700 text-xl">
            {isEditing ? "Editar evento" : "Crear nuevo evento"}
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">Completa la información del evento</DialogDescription>
        </DialogHeader>

        <EventForm
          selectedEvent={selectedEvent}
          isEditing={isEditing}
          onClose={() => setOpen(false)}
          onEventSaved={onEventSaved}
        />
      </DialogContent>
    </Dialog>
  )
}
