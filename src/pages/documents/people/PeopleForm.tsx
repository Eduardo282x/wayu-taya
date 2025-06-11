import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { PeopleBody } from "@/services/people/people.interface"
import { Button } from "@/components/ui/button";

interface PeopleFormProps {
    addPeople: (data: PeopleBody) => void
}

export const PeopleForm = ({ addPeople }: PeopleFormProps) => {
    const { register, handleSubmit } = useForm<PeopleBody>({
        defaultValues: {
            id_parroquia: 1,
            name: '',
            lastName: '',
            address: '',
            email: '',
            phone: '',
            identification: '',
            sex: '',
            birthdate: new Date(),
        }
    })

    const onSubmit = (data: PeopleBody) => {
        addPeople(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-left">
                        Nombre
                    </label>
                    <Input id="name" placeholder="Juan" {...register('name')} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="lastname" className="text-left">
                        Apellido
                    </label>
                    <Input
                        id="lastname"
                        {...register('lastName')}
                        placeholder="Pérez"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="identification" className="text-left">
                        Cédula
                    </label>
                    <Input
                        {...register('identification')}
                        id="identification"
                        placeholder="V-12345678"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="sex" className="text-left">
                        Sexo
                    </label>
                    <Input
                        id="sex"
                        {...register('sex')}
                        placeholder="Masculino/Femenino"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="address" className="text-left">
                        Dirección
                    </label>
                    <Input
                        id="address"
                        {...register('address')}
                        placeholder="Calle Principal, Casa #1"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="birthdate" className="text-left">
                        F. Nacimiento
                    </label>
                    <Input id="birthdate" {...register('birthdate')} type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-left">
                        Teléfono
                    </label>
                    <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="0414-1234567"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-left">
                        Correo Electrónico
                    </label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="ejemplo@dominio.com"
                        className="col-span-3"
                    />
                </div>

                <div className="flex items-center justify-end gap-2 w-full">
                    <Button type="submit">Guardar</Button>
                    <Button variant="outline">Cancelar</Button>
                </div>
            </form>
        </>
    )
}
