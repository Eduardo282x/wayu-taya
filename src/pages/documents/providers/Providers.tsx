import { useEffect, useState } from "react";
import { Column } from "@/components/table/table.interface";
import { FaRegTrashAlt, FaRegEdit, FaPlus } from "react-icons/fa";
import { TableComponents } from "@/components/table/TableComponents";
import { getProviders } from "@/services/provider/provider.service"; // Importa el servicio

export const providerColumns: Column[] = [
	{
		label: "Nombre del proveedor",
		column: "name",
		visible: true,
		isIcon: false,
		element: (data: any) => data.name,
	},
	{
		label: "Fecha de entrega",
		column: "deliveryDate",
		visible: true,
		isIcon: false,
		element: (data: any) =>
			new Date(data.deliveryDate).toLocaleDateString(),
	},
	{
		label: "Dirección",
		column: "address",
		visible: true,
		isIcon: false,
		element: (data: any) => data.address,
	},
	{
		label: "Teléfono",
		column: "phone",
		visible: true,
		isIcon: false,
		element: (data: any) => data.phone,
	},
	{
		label: "Correo",
		column: "email",
		visible: true,
		isIcon: false,
		element: (data: any) => data.email,
	},
	{
		label: "Editar",
		column: "edit",
		visible: true,
		isIcon: true,
		element: () => "",
		icon: {
			label: "Editar proveedor",
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
			label: "Eliminar proveedor",
			icon: FaRegTrashAlt,
			className: "text-red-600",
			variant: "ghost",
		},
	},
];

const initialForm = {
	name: "",
	deliveryDate: "",
	address: "",
	phone: "",
	email: "",
};

export const Providers = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState(initialForm);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	useEffect(() => {
		getProviders()
			.then((res) => setData(res))
			.finally(() => setLoading(false));
	}, []);

	// Maneja acciones de la tabla
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

	// Abre modal para agregar
	const handleAdd = () => {
		setForm(initialForm);
		setEditIndex(null);
		setShowModal(true);
	};

	// Guardar proveedor (nuevo o editado)
	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		if (editIndex !== null) {
			// Editar
			const newData = [...data];
			newData[editIndex] = form;
			setData(newData);
		} else {
			// Agregar
			setData([...data, form]);
		}
		setShowModal(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold">Proveedores</h2>
				<button
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					onClick={handleAdd}
				>
					<FaPlus /> Agregar proveedor
				</button>
			</div>
			{loading ? (
				<div>Cargando...</div>
			) : (
				<TableComponents
					column={providerColumns}
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
							{editIndex !== null ? "Editar proveedor" : "Agregar proveedor"}
						</h3>
						<input
							className="border p-2 rounded"
							placeholder="Nombre"
							value={form.name}
							onChange={e => setForm({ ...form, name: e.target.value })}
							required
						/>
						<input
							className="border p-2 rounded"
							type="date"
							placeholder="Fecha de entrega"
							value={form.deliveryDate}
							onChange={e => setForm({ ...form, deliveryDate: e.target.value })}
							required
						/>
						<input
							className="border p-2 rounded"
							placeholder="Dirección"
							value={form.address}
							onChange={e => setForm({ ...form, address: e.target.value })}
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
							placeholder="Correo"
							type="email"
							value={form.email}
							onChange={e => setForm({ ...form, email: e.target.value })}
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
