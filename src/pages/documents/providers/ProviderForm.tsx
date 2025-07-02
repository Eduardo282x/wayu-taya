import FormInputCustom from "@/components/formInput/FormInputCustom"
import { StyledDialog, StyledDialogContent, StyledDialogDescription, StyledDialogHeader, StyledDialogTitle } from "@/components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button"
import { IProviders, ProviderBody } from "@/services/provider/provider.interface"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FaRegSave } from "react-icons/fa"
import { TiUserAddOutline } from "react-icons/ti"

interface ProviderFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (provider: ProviderBody) => void
    provider: IProviders | null
}
export const ProviderForm = ({ open, onOpenChange, onSubmit, provider }: ProviderFormProps) => {
    const isEdit = !!provider;

    const { register, handleSubmit, reset, formState: { errors }, } = useForm<ProviderBody>({
        defaultValues: {
            name: '',
            rif: '',
            address: '',
            country: '',
            email: '',
        }
    })

    useEffect(() => {
        if (provider && isEdit) {
            const providerData = {
                name: provider.name,
                rif: provider.rif,
                address: provider.address,
                country: provider.country,
                email: provider.email,
            }
            reset(providerData)
        } else {
            const baseData = {
                name: '',
                rif: '',
                address: '',
                country: '',
                email: '',
            }
            reset(baseData)
        }
    }, [open, provider, reset])

    return (
        <StyledDialog open={open} onOpenChange={onOpenChange}>
            <StyledDialogContent className="w-[30rem] ">
                <StyledDialogHeader>
                    <StyledDialogTitle>{isEdit ? "Editar Proveedor" : "Crear Proveedor"}</StyledDialogTitle>
                    <StyledDialogDescription>
                        {isEdit
                            ? "Modifica los datos del Proveedor y guarda los cambios."
                            : "Completa los datos para crear un nuevo Proveedor."}
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
