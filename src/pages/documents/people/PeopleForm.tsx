import { useForm } from "react-hook-form"

// import { Input } from "@/components/ui/input"    
import { IPeople, PeopleBody } from "@/services/people/people.interface"
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import FormInputCustom from "@/components/formInput/FormInputCustom";

interface PeopleFormProps {
    people: IPeople | null;
    addPeople: (data: PeopleBody) => void;
}

export const PeopleForm = ({ addPeople, people }: PeopleFormProps) => {
    const { register, handleSubmit, reset } = useForm<PeopleBody>({
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

    useEffect(() => {
        if (people) {
            const setPeopleForm = {
                id_parroquia: people.parishId,
                name: people.name,
                lastName: people.lastName,
                address: people.address,
                email: people.email,
                phone: people.phone,
                identification: people.identification,
                sex: people.sex,
                birthdate: new Date(),
            }
            reset(setPeopleForm)
        }
    }, [people])

    const onSubmit = (data: PeopleBody) => {
        addPeople(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 py-2">
                <FormInputCustom
                    id="name"
                    label="Nombre"
                    placeholder="Juan"
                    {...register("name")}
                />
                <FormInputCustom
                    id="lastName"
                    label="Apellido"
                    placeholder="Perez"
                    {...register("lastName")}
                />
                <FormInputCustom
                    id="identification"
                    placeholder="V-12345678"
                    label="Cédula"
                    {...register("identification")}
                />
                <FormInputCustom
                    id="sex"
                    label="Sexo"
                    placeholder="Masculino/Femenino"
                    {...register("sex")}
                />
                <FormInputCustom
                    id="address"
                    label="Dirección"
                    placeholder="Calle Principal, Casa #1"
                    {...register("address")}
                />
                <FormInputCustom
                    id="birthdate"
                    label="F. Nacimiento"
                    type="date"
                    {...register("birthdate")}
                />
                <FormInputCustom
                    id="phone"
                    label="Teléfono"
                    placeholder="0414-1234567"
                    {...register("phone")}
                />
                <FormInputCustom
                    id="email"
                    label="Correo Electrónico"
                    {...register("email")}
                    type="email"
                    placeholder="ejemplo@dominio.com"
                />

                <div className="flex items-center justify-end gap-2 mt-2 w-full">
                    <Button type="submit">Guardar</Button>
                    <Button type="button" variant="outline">Cancelar</Button>
                </div>
            </form>
        </>
    )
}
