import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const EventForm = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Button className="text-left w-full">
            Mostrar detalles
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-col gap-2'>
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
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <Button className="text-left w-full">
            Datos del lugar
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-col gap-2'>
            <Label htmlFor="location">Dirección</Label>
            <input
              id="location"
              name="location"
              placeholder="Añade información del lugar del evento..."
              className="bg-[#5a8ed9] text-white text-xs rounded-md p-2 resize-none border border-transparent focus:outline-none focus:border-white"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <Button className="text-left w-full">
            Datos de proveedores
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className='w-full'>
            <Label htmlFor="contact">Datos de contacto del organizador</Label>
            <textarea
              id="contact"
              name="contact"
              placeholder="Añade datos de contacto del organizador..."
              className="bg-[#5a8ed9] text-white text-xs rounded p-2 resize-none border border-transparent focus:outline-none focus:border-white"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
