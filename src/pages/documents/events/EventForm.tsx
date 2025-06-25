import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface LocalEvent {
  id: string
  name: string
  date: string
  location?: string
  providers?: string[]
  startTime?: string
  endTime?: string
}

interface EventFormProps {
  selectedEvent: LocalEvent | null
  isEditing: boolean
  onClose: () => void
  onEventSaved: (event: LocalEvent) => void
}

const availableProviders = [
  "Perfumes",
  "Sonido",
  "Decoraciones",
  "Fotografía",
  "Seguridad",
  "Transporte",
  "Flores",
  "Iluminación",
  "Colgate",
  "Mobiliario",
  "Limpieza",
  "Coordinación",
]

export const EventForm = ({ selectedEvent, isEditing, onClose, onEventSaved }: EventFormProps) => {
  const [formData, setFormData] = useState<LocalEvent>({
    id: "",
    name: "",
    date: "",
    startTime: "08:00",
    endTime: "11:00",
    location: "",
    providers: [],
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
        providers: selectedEvent.providers || [],
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
        providers: [],
      })
    }
  }, [selectedEvent, isEditing])

  const handleInputChange = (field: keyof LocalEvent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleProviderSelect = (provider: string) => {
    if (!formData.providers?.includes(provider)) {
      setFormData((prev) => ({
        ...prev,
        providers: [...(prev.providers || []), provider],
      }))
    }
  }

  const removeProvider = (providerToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      providers: prev.providers?.filter((provider) => provider !== providerToRemove) || [],
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

  const unselectedProviders = availableProviders.filter((provider) => !formData.providers?.includes(provider))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventName" className="text-blue-700 font-medium">
          Nombre del evento *
        </Label>
        <Input
          id="eventName"
          name="eventName"
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
          placeholder="Ej: Gala Benéfica"
          className="bg-white border-blue-300 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-blue-700 font-medium">
            Hora inicio
          </Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("startTime", e.target.value)}
            className="bg-white border-blue-300 focus:border-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-blue-700 font-medium">
            Hora fin
          </Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("endTime", e.target.value)}
            className="bg-white border-blue-300 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventDate" className="text-blue-700 font-medium">
          Fecha *
        </Label>
        <Input
          id="eventDate"
          name="eventDate"
          type="date"
          value={formData.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("date", e.target.value)}
          className="bg-white border-blue-300 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-blue-700 font-medium">
          Ubicación
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("location", e.target.value)}
          placeholder="Dirección del evento"
          className="bg-white border-blue-300 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="providers" className="text-blue-700 font-medium">
          Proveedores
        </Label>

        {unselectedProviders.length > 0 && (
          <Select onValueChange={handleProviderSelect}>
            <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="Seleccionar proveedor" />
            </SelectTrigger>
            <SelectContent>
              {unselectedProviders.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {formData.providers && formData.providers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.providers.map((provider) => (
              <span
                key={provider}
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded-full text-sm inline-flex items-center"
              >
                {provider}
                <button
                  type="button"
                  onClick={() => removeProvider(provider)}
                  className="ml-2 hover:bg-blue-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {unselectedProviders.length === 0 && (
          <p className="text-sm text-blue-600">Todos los proveedores han sido seleccionados</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Evento"}
        </Button>
      </div>
    </form>
  )
}
