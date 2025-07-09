import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2"
import FormInputCustom from "@/components/formInput/FormInputCustom"
import { StyledDialog, StyledDialogContent, StyledDialogDescription, StyledDialogHeader, StyledDialogTitle } from "@/components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IInstitution, InstitutionsBody, IParish } from "@/services/institution/institution.interface"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { FaRegSave } from "react-icons/fa"
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

    const { register, handleSubmit, reset, watch, setValue,  formState: { errors }, control } = useForm<InstitutionsBody>({
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
        <StyledDialog open={open} onOpenChange={onOpenChange}>
            <StyledDialogContent className="w-[30rem] ">
                <StyledDialogHeader>
                    <StyledDialogTitle>{isEdit ? "Editar Institución" : "Crear Institución"}</StyledDialogTitle>
                    <StyledDialogDescription>
                        {isEdit
                            ? "Modifica los datos del Institución y guarda los cambios."
                            : "Completa los datos para crear un nuevo Institución."}
                    </StyledDialogDescription>
                </StyledDialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div>
                        <FormInputCustom
                            label="Nombre"
                            id="nombre"
                            autoFocus
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
                            {...register("rif", {
                                required: "El rif es obligatorio",
                            })}
                            error={errors.rif?.message}
                        />
                    </div>

                    <div>
                        <FormInputCustom
                            label="Dirección"
                            id="address"
                            {...register("address", {
                                required: "El Proveedor es obligatorio",
                            })}
                            error={errors.address?.message}
                        />
                    </div>

                    <div>
                        <FormInputCustom
                            label="Correo"
                            id="correo"
                            type="email"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
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
                                    Tipo
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
                        data={parish.map(ca => ({ label: `${ca.name} - ${ca.town.name} - Edo. ${ca.town.city.state.name}`, value: ca.id.toString() }))}
                        label={"Parroquia"}
                        valueDefault={watch('parishId')}
                        placeholder={"Seleccionar una parroquia"}
                        onChange={(value) => setValue('parishId', Number(value))}
                    />


                    <div className="flex justify-end space-x-2 pt-4">
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
            </StyledDialogContent>
        </StyledDialog>
    )
}
