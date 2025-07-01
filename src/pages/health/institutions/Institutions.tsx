import { useEffect, useState } from "react";
import { Column } from "@/components/table/table.interface";
import { FaRegTrashAlt, FaRegEdit, FaPlus } from "react-icons/fa";
import { TableComponents } from "@/components/table/TableComponents";

export const institutionColumns: Column[] = [
    {
        label: "Nombre de la institución",
        column: "name",
        visible: true,
        isIcon: false,
        element: (data: any) => data.name,
    },
    {
        label: "Ubicación",
        column: "location",
        visible: true,
        isIcon: false,
        element: (data: any) => data.location,
    },
    {
        label: "Teléfono",
        column: "phone",
        visible: true,
        isIcon: false,
        element: (data: any) => data.phone,
    },
    {
        label: "Donación",
        column: "donation",
        visible: true,
        isIcon: false,
        element: (data: any) => data.donation,
    },
    {
        label: "Editar",
        column: "edit",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Editar institución",
            icon: FaRegEdit,
            className: "text-blue-600",
            variant: "ghost",
        },
    },
    {
        label: "Eliminar",
        column: "delete",
        visible: true,
        isIcon: true,
        element: () => "",
        icon: {
            label: "Eliminar institución",
            icon: FaRegTrashAlt,
            className: "text-red-600",
            variant: "ghost",
        },
    },
];

const initialForm = {
    name: "",
    location: "",
    phone: "",
    donation: "",
};

export const Institutions = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        // getInstitutions()
        //     .then((res) => setData(res))
        //     .finally(() => setLoading(false));
        setLoading(false); // Quitar esto cuando uses el servicio real
    }, []);

    const handleActionTable = (action: string, row: any) => {
        if (action === "edit") {
            setForm(row);
            setEditIndex(data.indexOf(row));
            setShowModal(true);
        }
        if (action === "delete") {
            const index = data.indexOf(row);
            if (index !== -1) {
                setData(data.filter((_, i) => i !== index));
            }
        }
    };

    const handleAdd = () => {
        setForm(initialForm);
        setEditIndex(null);
        setShowModal(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editIndex !== null) {
            const newData = [...data];
            newData[editIndex] = form;
            setData(newData);
        } else {
            setData([...data, form]);
        }
        setShowModal(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Instituciones</h2>
                <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleAdd}
                >
                    <FaPlus /> Agregar institución
                </button>
            </div>
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <TableComponents
                    column={institutionColumns}
                    data={data}
                    actionTable={handleActionTable}
                />
            )}
            {/* Modal simple */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <form
                        className="bg-white p-6 rounded shadow-lg min-w-[320px] flex flex-col gap-3"
                        onSubmit={handleSave}
                    >
                        <h3 className="text-lg font-bold mb-2">
                            {editIndex !== null ? "Editar institución" : "Agregar institución"}
                        </h3>
                        <input
                            className="border p-2 rounded"
                            placeholder="Nombre de la institución"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Ubicación"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            required
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Teléfono"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Donación"
                            value={form.donation}
                            onChange={e => setForm({ ...form, donation: e.target.value })}
                            required
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};