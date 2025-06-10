import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormInputCustom from '@/components/formInput/FormInputCustom';

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
          <Button variant={'animated'} className="w-full">
            Mostrar detalles
          </Button>
        </AccordionTrigger>
        <AccordionContent className='FormDialogStyle px-1'>
          <div className='flex flex-col gap-2'>
            <FormInputCustom
              label='Nombre del Evento'
              id="eventName"
              name="eventName"
              type="text"
              defaultValue="Gala Benéfica"
              required
            />
            <Label className='text-blue-800' htmlFor="startDate">Fecha / hora de inicio</Label>
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
          <Button variant={'animated'} className="text-left w-full">
            Datos del lugar
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-col px-1'>
            <FormInputCustom
              label='Dirección'
              id="location"
              name="location"
              placeholder="Añade información del lugar del evento..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <Button variant={'animated'} className="text-left w-full">
            Datos de proveedores
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className='w-full px-1'>
            <FormInputCustom
              label='Datos de contacto del organizador'
              id="contact"
              name="contact"
              placeholder="Añade datos de contacto del organizador..."
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
