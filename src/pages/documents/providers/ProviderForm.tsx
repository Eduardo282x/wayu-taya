import FormInputCustom from "@/components/formInput/FormInputCustom"
import { Button } from "@/components/ui/button"
import { IProviders, ProviderBody } from "@/services/provider/provider.interface"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FaRegSave, FaArrowLeft } from "react-icons/fa"
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
            responsible: '',
            phone: '',
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
                responsible: '',
                phone: '',
            }
            reset(providerData)
        } else {
            const baseData = {
                name: '',
                rif: '',
                address: '',
                country: '',
                email: '',
                responsible: '',
                phone: '',
            }
            reset(baseData)
        }
    }, [open, provider, reset])

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 border-b-2 border-gray-300">
                <div>
                    <h2 className="bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent manrope text-2xl">
                        {isEdit ? "Editar Proveedor" : "Crear Proveedor"}
                    </h2>
                    <p className="manrope text-sm text-gray-600">
                        {isEdit
                            ? "Modifica los datos del Proveedor y guarda los cambios."
                            : "Completa los datos para crear un nuevo Proveedor."}
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

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 overflow-y-auto">
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
                        {...register("rif", {
                            required: "El rif es obligatorio",
                        })}
                        error={errors.rif?.message}
                    />
                </div>

                <div>
                    <FormInputCustom
                        label="Responsable"
                        id="responsible"
                        {...register("responsible", {
                            required: "El responsable es obligatorio",
                        })}
                        error={errors.responsible?.message}
                    />
                </div>

                <div>
                    <FormInputCustom
                        label="Teléfono"
                        id="phone"
                        {...register("phone", {
                            required: "El teléfono es obligatorio",
                            pattern: {
                                value: /^[0-9+\-\s]+$/,
                                message: "Teléfono inválido",
                            },
                        })}
                        error={errors.phone?.message}
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
        </div>
    )
}
