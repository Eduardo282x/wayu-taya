import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IInstitution, InstitutionsBody, IParish } from "@/services/institution/institution.interface"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { FaRegSave, FaArrowLeft } from "react-icons/fa"
import { TiUserAddOutline } from "react-icons/ti"

interface InstitutionFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (institution: InstitutionsBody) => void
    institution: IInstitution | null;
    parish: IParish[]
}
export const InstitutionForm = ({ open, onOpenChange, onSubmit, institution, parish }: InstitutionFormProps) => {
    const isEdit = !!institution;

    const { register, handleSubmit, reset, watch, setValue, formState: { errors }, control } = useForm<InstitutionsBody>({
        defaultValues: {
            name: '',
            rif: '',
            address: '',
            country: '',
            email: '',
            type: '',
            parishId: 0,
        }
    })

    useEffect(() => {
        if (institution && isEdit) {
            const institutionData = {
                name: institution.name,
                rif: institution.rif,
                address: institution.address,
                country: institution.country,
                email: institution.email,
                type: institution.type,
                parishId: institution.parishId,
            }
            reset(institutionData)
        } else {
            const baseData = {
                name: '',
                rif: '',
                address: '',
                country: '',
                email: '',
                type: '',
                parishId: 0,
            }
            reset(baseData)
        }
    }, [open, institution, reset])

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 border-b-2 border-gray-300">
                <div>
                    <h2 className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
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

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4 p-4 overflow-y-auto">
                <div>
                    <FormInputCustom
                        label="Nombre"
                        id="nombre"
                        {...register("name", {
                            required: "El nombre es obligatorio",
                        })}
                        error={errors.name?.message}
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
                        label="Dirección"
                        id="address"
                        {...register("address", {
                            required: "La dirección es obligatoria",
                        })}
                        error={errors.address?.message}
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

                <FormAutocompleteV2
                    // data={parish.map(ca => ({ label: `${ca.name} - ${ca.town.name} - Edo. ${ca.town.city.state.name}`, value: ca.id.toString() }))}
                    data={parish.map(ca => ({ label: `${ca.name}`, value: ca.id.toString() }))}
                    label={"Parroquia"}
                    valueDefault={watch('parishId')}
                    placeholder={"Seleccionar una parroquia"}
                    onChange={(value) => setValue('parishId', Number(value))}
                />

                <div className="col-span-3 flex items-center justify-center pt-4">
                    <Button
                        variant="animated"
                        className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
                        type="submit"
                    >
                        {isEdit ? (
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
    )
}
