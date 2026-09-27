import { useForm } from "react-hook-form"

// import { Input } from "@/components/ui/input"    
import { IPeople, PeopleBody } from "@/services/people/people.interface"
import type { Location } from "@/services/location.interface"
import { DialogLocation } from "@/components/dialog-location/Dialog-Location"
import { formatLabelLocation } from "@/hooks/formaters"
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import FormInputCustom from "@/components/formInput/FormInputCustom";
import { FaMapMarkerAlt } from "react-icons/fa";

const EMPTY_LOCATION: Location = { state: "", town: "", parish: "" };

interface PeopleFormProps {
    people: IPeople | null;
    addPeople: (data: PeopleBody) => void;
}

export const PeopleForm = ({ addPeople, people }: PeopleFormProps) => {
    const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PeopleBody>({
        defaultValues: {
            location: { ...EMPTY_LOCATION },
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
                // `location` es una columna Json: las filas anteriores a la
                // migracion pueden traerla nula, y el backend la exige con los
                // tres niveles. Si no esta, se deja vacia para elegirla.
                location: people.location ?? { ...EMPTY_LOCATION },
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

    const watchedLocation = watch("location");

    // Identidad estable: el dialogo reinicia su cascada cuando cambia la
    // referencia de `value`, y `watch` puede devolver un objeto nuevo.
    const dialogLocation = useMemo<Location>(
        () => ({
            state: watchedLocation?.state ?? "",
            town: watchedLocation?.town ?? "",
            parish: watchedLocation?.parish ?? "",
        }),
        [watchedLocation?.state, watchedLocation?.town, watchedLocation?.parish]
    );

    /**
     * El dialogo aporta los tres niveles. Se escribe hoja por hoja porque son
     * las rutas registradas con `required`: asi el submit se bloquea aqui y no
     * con un 400 del backend.
     */
    const handleLocationConfirm = (value: Location) => {
        setValue("location.state", value.state, { shouldValidate: true, shouldDirty: true });
        setValue("location.town", value.town, { shouldValidate: true, shouldDirty: true });
        setValue("location.parish", value.parish, { shouldValidate: true, shouldDirty: true });
        setIsLocationOpen(false);
    };

    const locationCompleta = !!dialogLocation.state && !!dialogLocation.town && !!dialogLocation.parish;

    const locationError =
        errors.location?.state?.message
        ?? errors.location?.town?.message
        ?? errors.location?.parish?.message;

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
                    multiline
                    rows={2}
                    placeholder="Calle Principal, Casa #1"
                    {...register("address")}
                />

                {/* La ubicacion no tiene control visible propio: la elige el
                    dialogo. Estos campos ocultos existen para que RHF registre
                    cada nivel con `required`. */}
                <input type="hidden" {...register("location.state", { required: "Selecciona el estado" })} />
                <input type="hidden" {...register("location.town", { required: "Selecciona el municipio" })} />
                <input type="hidden" {...register("location.parish", { required: "Selecciona la parroquia" })} />

                <div className="flex flex-col gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsLocationOpen(true)}
                        className="w-full gap-2 text-[0.8rem]"
                    >
                        <FaMapMarkerAlt /> Seleccionar parroquia
                    </Button>
                    {locationCompleta ? (
                        <p className="text-xs text-gray-500 manrope">{formatLabelLocation(dialogLocation)}</p>
                    ) : (
                        <p className="text-xs text-gray-500 manrope">
                            Añade el estado, el municipio y la parroquia de la persona.
                        </p>
                    )}
                    {locationError && <p className="text-red-500 text-xs">{locationError}</p>}
                </div>

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

            {/* Fuera del `<form>` para que el boton del dialogo no dispare el
                submit. Sigue dentro del Dialog padre en el arbol de React, que
                es lo que hace que Radix no cierre ese Dialog al pulsar aqui. */}
            <DialogLocation
                open={isLocationOpen}
                onOpenChange={setIsLocationOpen}
                onConfirm={handleLocationConfirm}
                value={dialogLocation}
            />
        </>
    )
}
