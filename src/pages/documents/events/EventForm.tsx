import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface LocalEvent {
  id: string
  name: string
  date: string
  location?: string
  contact?: string
  startTime?: string
  endTime?: string
}

interface EventFormProps {
  selectedEvent: LocalEvent | null
  isEditing: boolean
  onClose: () => void
  onEventSaved: (event: LocalEvent) => void
}

export const EventForm = ({ selectedEvent, isEditing, onClose, onEventSaved }: EventFormProps) => {
  const [formData, setFormData] = useState<LocalEvent>({
    id: "",
    name: "",
    date: "",
    startTime: "08:00",
    endTime: "11:00",
    location: "",
    contact: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedEvent && isEditing) {
      const eventDate = new Date(selectedEvent.date)
      setFormData({
        id: selectedEvent.id,
        name: selectedEvent.name || "",
        date: eventDate.toISOString().split("T")[0],
        startTime: selectedEvent.startTime || "08:00",
        endTime: selectedEvent.endTime || "11:00",
        location: selectedEvent.location || "",
        contact: selectedEvent.contact || "",
      })
    } else {
      const today = new Date()
      setFormData({
        id: "",
        name: "",
        date: today.toISOString().split("T")[0],
        startTime: "08:00",
        endTime: "11:00",
        location: "",
        contact: "",
      })
    }
  }, [selectedEvent, isEditing])

  const handleInputChange = (field: keyof LocalEvent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newEvent: LocalEvent = {
        ...formData,
        date: formData.date,
      }

      console.log("Event data:", newEvent)

      onEventSaved(newEvent)
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventName" className="text-slate-700 font-medium">
          Nombre del evento *
        </Label>
        <Input
          id="eventName"
          name="eventName"
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
          placeholder="Ej: Gala Benéfica"
          className="bg-white border-slate-300 focus:border-slate-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-slate-700 font-medium">
            Fecha *
          </Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            value={formData.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("date", e.target.value)}
            className="bg-white border-slate-300 focus:border-slate-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-slate-700 font-medium">
            Hora inicio
          </Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("startTime", e.target.value)}
            className="bg-white border-slate-300 focus:border-slate-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endTime" className="text-slate-700 font-medium">
          Hora fin
        </Label>
        <Input
          id="endTime"
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("endTime", e.target.value)}
          className="bg-white border-slate-300 focus:border-slate-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-slate-700 font-medium">
          Ubicación
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("location", e.target.value)}
          placeholder="Dirección del evento"
          className="bg-white border-slate-300 focus:border-slate-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact" className="text-slate-700 font-medium">
          Contacto del organizador
        </Label>
        <Input
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("contact", e.target.value)}
          placeholder="Información de contacto"
          className="bg-white border-slate-300 focus:border-slate-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-slate-600 hover:bg-slate-700" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Evento"}
        </Button>
      </div>
    </form>
  )
}
