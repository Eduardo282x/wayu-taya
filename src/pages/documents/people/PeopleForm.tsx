// import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"

export const PeopleForm = () => {
    // const {register, handleSubmit} = useForm({
    //     defaultValues: {

    //     }
    // })

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-left">
                        Nombre
                    </label>
                    <Input id="name" placeholder="Juan" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="lastname" className="text-left">
                        Apellido
                    </label>
                    <Input
                        id="lastname"
                        placeholder="Pérez"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="identification" className="text-left">
                        Cédula
                    </label>
                    <Input
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
                        placeholder="Calle Principal, Casa #1"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="birthdate" className="text-left">
                        F. Nacimiento
                    </label>
                    <Input id="birthdate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-left">
                        Teléfono
                    </label>
                    <Input
                        id="phone"
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
                        placeholder="ejemplo@dominio.com"
                        className="col-span-3"
                    />
                </div>
            </div>
        </>
    )
}
