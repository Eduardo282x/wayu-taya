import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2"
import { IProviders } from "@/services/provider/provider.interface"
import { EventsBody, IEvents } from "@/services/events/events.interface"

interface EventFormProps {
  selectedEvent: IEvents | null
  isEditing: boolean;
  providers: IProviders[];
  onClose: () => void
  onEventSaved: (event: EventsBody) => void
}

export const EventForm = ({ selectedEvent, providers, isEditing, onClose, onEventSaved }: EventFormProps) => {
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const defaultTime = today.toTimeString().slice(0, 5); // "HH:mm"


  const [formData, setFormData] = useState<EventsBody>({
    parishId: 1,
    name: '',
    description: '',
    address: '',
    startDate: defaultDate,
    endDate: defaultDate,
    startTime: defaultTime,
    endTime: defaultTime,
    providersId: [],
    cambio_proveedores: false,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        parishId: selectedEvent.parishId,
        name: selectedEvent.name,
        description: selectedEvent.description,
        address: selectedEvent.address,
        startDate: new Date(selectedEvent.startDate).toISOString().split('T')[0],
        endDate: new Date(selectedEvent.endDate).toISOString().split('T')[0],
        startTime: new Date(selectedEvent.startDate).toISOString().split('T')[1].slice(0, 5),
        endTime: new Date(selectedEvent.endDate).toISOString().split('T')[1].slice(0, 5),
        providersId: selectedEvent.providersEvents.map(pro => pro.id),
        cambio_proveedores: false,
      })
    }
  }, [selectedEvent])

  const handleInputChange = (field: keyof EventsBody, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleProviderSelect = (provider: string | number) => {
    if (!formData.providersId.includes(Number(provider))) {
      setFormData((prev) => ({
        ...prev,
        cambio_proveedores: true,
        providersId: [...prev.providersId, Number(provider)],
      }))
    }
  }

  const removeProvider = (providerToRemove: string | number) => {
    setFormData((prev) => ({
      ...prev,
      providersId: prev.providersId?.filter((provider) => provider !== Number(providerToRemove)),
    }))
  }

  const returnNameProvider = (providerId: number | string): string => {
    const findProvider = providers.find(pro => pro.id == Number(providerId));
    if (findProvider) {
      return findProvider.name
    }

    return '';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onEventSaved(formData)
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setLoading(false)
    }
  }

  // const unselectedProviders = providers.filter((provider) => !formData.providers?.includes(provider.id.toString()))

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
          value={formData.startDate.toString()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("startDate", e.target.value)}
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
          value={formData.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("address", e.target.value)}
          placeholder="Dirección del evento"
          className="bg-white border-blue-300 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        {/* <Label htmlFor="providers" className="text-blue-700 font-medium">
          Proveedores
        </Label> */}

        <FormAutocompleteV2
          label="Proveedor"
          placeholder="Selecciona un proveedor"
          data={providers.map(provider => ({
            value: provider.id.toString(),
            label: provider.name,
          }))}
          onChange={(value) => handleProviderSelect(value)}
        />

        {/* {unselectedProviders.length > 0 && (
          <Select onValueChange={handleProviderSelect}>
            <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="Seleccionar proveedor" />
            </SelectTrigger>
            <SelectContent>
              {unselectedProviders.map((provider, index: number) => (
                <SelectItem key={index} value={provider.id.toString()}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} */}

        {formData.providersId && formData.providersId.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.providersId.map((provider) => (
              <span
                key={provider}
                className="text-blue-700 bg-blue-200 px-2 pr-1 py-1 rounded-full text-sm inline-flex items-center"
              >
                {returnNameProvider(provider)}
                <button
                  type="button"
                  onClick={() => removeProvider(provider)}
                  className="ml-2 hover:bg-blue-300 rounded-full p-1 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* {unselectedProviders.length === 0 && (
          <p className="text-sm text-blue-600">Todos los proveedores han sido seleccionados</p>
        )} */}
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
