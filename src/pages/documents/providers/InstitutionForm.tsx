import FormInputCustom from "@/components/formInput/FormInputCustom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogLocation } from "@/components/dialog-location/Dialog-Location"
import { formatLabelLocation } from "@/hooks/formaters"
import { IInstitution, InstitutionsBody } from "@/services/institution/institution.interface"
import type { Location } from "@/services/location.interface"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { FaMapMarkerAlt, FaRegSave, FaArrowLeft, FaSpinner } from "react-icons/fa"
import { TiUserAddOutline } from "react-icons/ti"

const EMPTY_LOCATION: Location = { state: "", town: "", parish: "" };
interface InstitutionFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (institution: InstitutionsBody) => void
    institution: IInstitution | null;
    isSubmitting?: boolean
}
export const InstitutionForm = ({ open, onOpenChange, onSubmit, institution, isSubmitting = false }: InstitutionFormProps) => {
    const isEdit = !!institution;
    const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors }, control } = useForm<InstitutionsBody>({
        defaultValues: {
            name: '',
            rif: '',
            address: '',
            country: '',
            responsible: '',
            phone: '',
            email: '',
            type: '',
            location: { ...EMPTY_LOCATION },
        }
    })

    useEffect(() => {
        if (!open) return;
        if (institution && isEdit) {
            const institutionData = {
                name: institution.name,
                rif: institution.rif,
                address: institution.address,
                country: institution.country,
                email: institution.email,
                responsible: institution.responsible,
                phone: institution.phone,
                type: institution.type,
                // `location` es una columna Json: las filas anteriores a la
                // migracion pueden traerla nula o incompleta, y el backend la
                // exige con los tres niveles. En ese caso se deja vacia para
                // que el usuario la elija antes de guardar.
                location: institution.location ?? { ...EMPTY_LOCATION },
            }
            reset(institutionData)
        } else {
            const baseData = {
                name: '',
                rif: '',
                address: '',
                country: '',
                email: '',
                phone: '',
                type: '',
                location: { ...EMPTY_LOCATION },
            }
            reset(baseData)
        }
    }, [open, institution, reset])

    const watchedLocation = watch("location");

    // Identidad estable: el dialogo reinicia su cascada cada vez que cambia la
    // referencia de `value`, y `watch` puede devolver un objeto nuevo en cada
    // render.
    const dialogLocation = useMemo<Location>(
        () => ({
            state: watchedLocation?.state ?? "",
            town: watchedLocation?.town ?? "",
            parish: watchedLocation?.parish ?? "",
        }),
        [watchedLocation?.state, watchedLocation?.town, watchedLocation?.parish]
    );

    /**
     * El dialogo aporta los tres niveles de la ubicacion. Se escriben hoja por
     * hoja porque son las rutas que estan registradas con `required`: asi el
     * submit se bloquea aqui y no con un 400 del backend.
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

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 border-b-2 border-gray-300">
                    <div>
                        <h2 className="bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent manrope text-2xl">
                            {isEdit ? "Editar Institución" : "Crear Institución"}
                        </h2>
                        <p className="manrope text-sm text-gray-600">
                            {isEdit
                                ? "Modifica los datos de la Institución y guarda los cambios."
                                : "Completa los datos para crear una nueva Institución."}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2"
                    >
                        <FaArrowLeft /> Volver
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 lg:space-y-0 lg:grid grid-cols-3 gap-4 py-4 lg:px-4 overflow-y-auto">
                    <div>
                        <FormInputCustom
                            label="Nombre de la Institución"
                            id="nombre"
                            {...register("name", {
                                required: "El nombre es obligatorio",
                            })}
                            error={errors.name?.message}
                        />
                    </div>

                    <div>
                        <FormInputCustom
                            label="Persona Responsable"
                            id="responsible"
                            {...register("responsible", {
                                required: "La persona responsable es obligatoria",
                            })}
                            error={errors.responsible?.message}
                        />
                    </div>

                    <div>
                        <FormInputCustom
                            label="Rif"
                            id="rif"
                            required={false}
                            {...register("rif")}
                            error={errors.rif?.message}
                        />
                    </div>

                    <div>
                        <FormInputCustom
                            label="Teléfono"
                            id="phone"
                            required={true}
                            {...register("phone")}
                            error={errors.phone?.message}
                        />
                    </div>

                    <div>
                        <FormInputCustom
                            label="Correo"
                            id="correo"
                            type="email"
                            required={false}
                            {...register("email", {
                                pattern: {
                                    value: /^(?:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)?$/,
                                    message: "Correo inválido",
                                },
                            })}
                            error={errors.email?.message}
                        />
                    </div>

                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: "La categoría es obligatoria" }}
                        render={({ field }) => (
                            <div className="space-y-1">
                                <label
                                    htmlFor="type-select"
                                    className="text-sm font-medium leading-none text-blue-800"
                                >
                                    Tipo <span className="text-red-500">*</span>
                                </label>
                                <Select onValueChange={field.onChange} value={field.value.toString()}>
                                    <SelectTrigger className="w-full" id="type-select">
                                        <SelectValue placeholder="Selecciona un Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tipo</SelectLabel>
                                            {['Centro de salud', 'Institución', 'Organización'].map((option: string, index: number) => (
                                                <SelectItem key={index} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.type.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    <div className="w-full col-span-3">
                        <label className="block text-sm whitespace-nowrap font-medium mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent">
                            Parroquia <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center justify-start gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsLocationOpen(true)}
                                className="gap-2 text-[0.8rem]"
                            >
                                {locationCompleta ? (
                                    <p className="text-sm text-gray-800 manrope">
                                        {formatLabelLocation(dialogLocation)}
                                    </p>
                                ) : (
                                    <div className="flex items-center justify-center gap-2"><FaMapMarkerAlt /> Buscar parroquia</div>
                                )}
                            </Button>
                            {!locationCompleta && (
                                <p className="text-xs text-gray-500 manrope">
                                    Añade el estado, el municipio y la parroquia de la institución.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* La ubicacion no tiene un control visible propio: la elige el
                    dialogo. Estos tres campos ocultos existen para que RHF
                    registre cada nivel con `required`, que es lo que bloquea el
                    submit cuando falta alguno. */}
                    <input type="hidden" {...register("location.state", { required: "Selecciona el estado" })} />
                    <input type="hidden" {...register("location.town", { required: "Selecciona el municipio" })} />
                    <input type="hidden" {...register("location.parish", { required: "Selecciona la parroquia" })} />

                    <div className="col-span-3">
                        <FormInputCustom
                            label="Dirección"
                            id="address"
                            multiline
                            rows={3}
                            placeholder="urb buena vista, calle #21"
                            {...register("address", {
                                required: "La dirección es obligatoria",
                            })}
                            error={errors.address?.message}
                        />
                        {locationError && (
                            <p className="text-red-500 text-xs mt-1">{locationError}</p>
                        )}
                    </div>

                    <div className="col-span-3 flex items-center justify-center pt-4">
                        <Button
                            variant="animated"
                            className="p-3 w-full lg:w-[25%] h-[90%] bg-linear-to-r from-blue-800 to-[#58c0e9]"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="self-center size-5 animate-spin" /> Guardando...
                                </>
                            ) : isEdit ? (
                                <>
                                    <FaRegSave className="self-center size-5" /> Guardar
                                </>
                            ) : (
                                <>
                                    <TiUserAddOutline className="self-center size-5" /> Crear
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            <DialogLocation
                open={isLocationOpen}
                onOpenChange={setIsLocationOpen}
                onConfirm={handleLocationConfirm}
                value={dialogLocation}
            />
        </>
    )
}
