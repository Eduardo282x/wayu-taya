import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EventForm = () => {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const toggleDetails = () => setIsDetailsOpen(!isDetailsOpen);
  const toggleLocation = () => setIsLocationOpen(!isLocationOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-xs w-full rounded-[20px] border border-[#2e5ea8] p-4 bg-[#3b7ac9]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-lg select-none">Detalles del evento</h1>
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            Cerrar
          </Button>
        </div>

        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button className="w-full bg-[#5a8ed9] rounded px-2 py-1 mb-4 flex items-center text-xs font-semibold justify-center">
                <i className="fas fa-calendar-plus mr-2"></i> Agendar evento
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-xs rounded-[20px] p-4 bg-[#3b7ac9] border border-[#2e5ea8] text-white font-sans">
              <DialogHeader>
                <DialogTitle>Editar evento</DialogTitle>
                <DialogDescription className="text-white text-xs mb-4">
                  A continuación introduce la información del evento
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Button onClick={toggleDetails} className="text-left w-full">
                    {isDetailsOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
                  </Button>
                  {isDetailsOpen && (
                    <>
                      <Label htmlFor="eventName">Nombre del evento</Label>
                      <Input
                        id="eventName"
                        name="eventName"
                        type="text"
                        defaultValue="Gala Benéfica"
                        className="bg-[#5a8ed9] text-white text-xs rounded px-2 py-1 border border-transparent focus:outline-none focus:border-white"
                        required
                      />
                      <Label htmlFor="startDate">Fecha / hora de inicio</Label>
                      <div className="flex gap-2">
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          defaultValue="2025-02-28"
                          className="bg-[#5a8ed9] text-white text-xs rounded px-2 py-1 border border-transparent focus:outline-none focus:border-white flex-1"
                          required
                        />
                        <Input
                          id="startTime"
                          name="startTime"
                          type="time"
                          defaultValue="13:00"
                          className="bg-[#5a8ed9] text-white text-xs rounded px-2 py-1 border border-transparent focus:outline-none focus:border-white w-20"
                          required
                        />
                      </div>
                      <Label htmlFor="endDate">Fecha / hora de fin</Label>
                      <div className="flex gap-2">
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          defaultValue="2025-02-28"
                          className="bg-[#5a8ed9] text-white text-xs rounded px-2 py-1 border border-transparent focus:outline-none focus:border-white flex-1"
                          required
                        />
                        <Input
                          id="endTime"
                          name="endTime"
                          type="time"
                          defaultValue="15:00"
                          className="bg-[#5a8ed9] text-white text-xs rounded px-2 py-1 border border-transparent focus:outline-none focus:border-white w-20"
                          required
                        />
                      </div>
                      <Label htmlFor="timezone">Zona horaria</Label>
                      <select
                        id="timezone"
                        name="timezone"
                        className="bg-[#5a8ed9] text-white text-xs rounded px-2 py-1 border border-transparent focus:outline-none focus:border-white"
                        defaultValue="Venezuela"
                        required
                      >
                        <option>Venezuela</option>
                        <option>UTC-3</option>
                        <option>UTC-4</option>
                        <option>UTC-5</option>
                        <option>UTC</option>
                        <option>GMT+1</option>
                      </select>
                    </>
                  )}
                </div>

                <div className="grid gap-3">
                  <Button onClick={toggleLocation} className="text-left w-full">
                    {isLocationOpen ? 'Ocultar datos del lugar' : 'Mostrar datos del lugar'}
                  </Button>
                  {isLocationOpen && (
                    <>
                      <Label htmlFor="location">Datos del lugar del evento</Label>
                      <textarea
                        id="location"
                        name="location"
                        rows={3}
                        placeholder="Añade información del lugar del evento..."
                        className="bg-[#5a8ed9] text-white text-xs rounded p-2 resize-none border border-transparent focus:outline-none focus:border-white"
                      />
                      <Label htmlFor="description">Descripción del lugar</Label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Añade descripción del lugar..."
                        className="bg-[#5a8ed9] text-white text-xs rounded p-2 resize-none border border-transparent focus:outline-none focus:border-white"
                      />
                    </>
                  )}
                </div>

                <div className="grid gap-3">
                  <Button onClick={toggleContact} className="text-left w-full">
                    {isContactOpen ? 'Ocultar datos de contacto' : 'Mostrar datos de contacto'}
                  </Button>
                  {isContactOpen && (
                    <>
                      <Label htmlFor="contact">Datos de contacto del organizador</Label>
                      <textarea
                        id="contact"
                        name="contact"
                        rows={3}
                        placeholder="Añade datos de contacto del organizador..."
                        className="bg-[#5a8ed9] text-white text-xs rounded p-2 resize-none border border-transparent focus:outline-none focus:border-white"
                      />
                    </>
                  )}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
};
