import { useEffect, useState } from "react";
import { Column } from "@/components/table/table.interface";
import { FaPlus, FaUserTie } from "react-icons/fa";
import { deleteProviders, getProviders, postProviders, putProviders } from "@/services/provider/provider.service"; // Importa el servicio
import { GroupProviders, IProviders, ProviderBody } from "@/services/provider/provider.interface";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { HeaderPages } from "@/pages/layout/Header";
import { FilterComponent } from "@/components/table/FilterComponent";
import { Button } from "@/components/ui/button";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";
import { GroupInstitution, IInstitution, InstitutionsBody, IParish } from "@/services/institution/institution.interface";
import { deleteInstitutions, getInstitutions, getParish, postInstitutions, putInstitutions } from "@/services/institution/institution.service";
import { TableComponents } from "@/components/table/TableComponents";
import { ProviderForm } from "./ProviderForm";
import { InstitutionForm } from "./InstitutionForm";
import { institutionColumns, providerColumns } from "./providerInstitution.data";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type view = 'provider' | 'institution';

export const ProvidersInstitutions = () => {
	const [columns, setColumns] = useState<Column[]>(providerColumns);
	const [providers, setProviders] = useState<GroupProviders>({ allProviders: [], providers: [] });
	const [parish, setParish] = useState<IParish[]>([]);
	const [institution, setInstitution] = useState<GroupInstitution>({ allInstitution: [], institution: [] });
	const [loading, setLoading] = useState(true);
	const [currentView, setCurrentView] = useState<view>('provider');
	const [openDialogDelete, setOpenDialogDelete] = useState(false);
	const [openProvider, setOpenProvider] = useState(false);
	const [openInstitution, setOpenInstitution] = useState(false);
	const [providerSelected, setProviderSelected] = useState<IProviders | null>(null);
	const [institutionSelected, setInstitutionSelected] = useState<IInstitution | null>(null);

	useEffect(() => {
		getProvidersApi();
		getInstitutionsApi();
		getParishApi();
	}, []);

	const getParishApi = async () => {
		try {
			const response: IParish[] = await getParish();
			setParish(response)
		} catch (err) {
			console.log(err);
		}
	}

	const getProvidersApi = async () => {
		setLoading(true)
		try {
			const response: IProviders[] = await getProviders();
			setProviders({ allProviders: response, providers: response })
		} catch (err) {
			console.log(err);
		}
		setLoading(false)
	}

	const getInstitutionsApi = async () => {
		setLoading(true)
		try {
			const response: IInstitution[] = await getInstitutions();
			setInstitution({ allInstitution: response, institution: response })
		} catch (err) {
			console.log(err);
		}
		setLoading(false)
	}

	const tabSelected = (tab: view): string => {
		if (tab == currentView) {
			return 'bg-gradient-to-r from-blue-800 to-[#58c0e9] text-white'
		}
		return 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
	}
	const changeTab = (tab: view) => {
		setCurrentView(tab)
		setColumns(tab == 'provider' ? providerColumns : institutionColumns);
	}

	const setFilter = (data: IProviders[] | IInstitution[]) => {
		if (currentView == 'provider') setProviders((prev) => ({ ...prev, providers: data as IProviders[] }))
		if (currentView == 'institution') setInstitution((prev) => ({ ...prev, institution: data as IInstitution[] }))
	}

	const newElement = () => {
		setProviderSelected(null);
		setInstitutionSelected(null);
		if (currentView == 'provider') setOpenProvider(true);
		if (currentView == 'institution') setOpenInstitution(true);
	}

	const getActionForm = async (data: ProviderBody | InstitutionsBody) => {
		if (providerSelected || institutionSelected) {
			if (currentView == 'provider') await putProviders(Number(providerSelected?.id), data as ProviderBody)
			if (currentView == 'institution') await putInstitutions(Number(institutionSelected?.id), data as InstitutionsBody)
		} else {
			if (currentView == 'provider') await postProviders(data as ProviderBody)
			if (currentView == 'institution') await postInstitutions(data as InstitutionsBody)
		}

		setOpenInstitution(false);
		setOpenProvider(false);

		if (currentView == 'provider') await getProvidersApi();
		if (currentView == 'institution') await getInstitutionsApi();
	};

	const getActionTable = (action: string, data: IProviders | IInstitution) => {
		setProviderSelected(data as IProviders);
		setInstitutionSelected(data as IInstitution);
		if (action === "edit" && currentView == 'provider') setOpenProvider(true);
		if (action === "edit" && currentView == 'institution') setOpenInstitution(true);
		if (action === "delete") {
			setOpenDialogDelete(true);
		}
	};

	const confirmDelete = async () => {
		if (currentView == 'provider') await deleteProviders(Number(providerSelected?.id))
		if (currentView == 'institution') await deleteInstitutions(Number(institutionSelected?.id))

		setOpenDialogDelete(false);

		if (currentView == 'provider') await getProvidersApi();
		if (currentView == 'institution') await getInstitutionsApi();
	};

	return (
		<div className='px-3 lg:p-0 '>
			{loading && (
				<ScreenLoader />
			)}

			<HeaderPages title={currentView === "provider" ? "Proveedores" : "Instituciones"} Icon={FaUserTie} />

			<div className="flex justify-between items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
				<div className="flex items-center gap-2">
					<Button
						variant={currentView === "provider" ? "animated" : "outline"}
						className={tabSelected('provider')}
						onClick={() => changeTab("provider")}
					>
						Proveedores
					</Button>
					<Button
						variant={currentView === "institution" ? "animated" : "outline"}
						className={tabSelected('institution')}
						onClick={() => changeTab("institution")}
					>
						Instituciones
					</Button>
				</div>

				<div className="flex items-center ">
					<DropdownColumnFilter columns={columns} setColumns={setColumns} />
					<FilterComponent
						data={currentView == 'provider' ? providers.allProviders : institution.allInstitution}
						columns={currentView == 'provider' ? providerColumns : institutionColumns}
						setDataFilter={setFilter}
						placeholder={currentView == 'provider' ? "Buscar proveedor..." : "Buscar Institución..."}
					/>
					<Button
						variant={"animated"}
						className="w-fit lg:h-full text-[0.8rem] lg:text-[1rem]"
						onClick={newElement}
					>
						<FaPlus className="w-4 h-4" />
						Crear {currentView == 'provider' ? 'Proveedor' : 'Institución'}
					</Button>
				</div>
			</div>

			<div className="mt-1 lg:mt-4 ">
				<TableComponents
					data={currentView == 'provider' ? providers.providers : institution.institution}
					column={columns.filter(col => col.visible == true)}
					actionTable={getActionTable}
				/>

				<ProviderForm
					open={openProvider}
					onOpenChange={setOpenProvider}
					provider={providerSelected}
					onSubmit={getActionForm}
				/>

				<InstitutionForm
					open={openInstitution}
					onOpenChange={setOpenInstitution}
					institution={institutionSelected}
					onSubmit={getActionForm}
					parish={parish}
				/>

				<ConfirmDeleteDialog
					open={openDialogDelete}
					onOpenChange={setOpenDialogDelete}
					onConfirm={confirmDelete}
					name={currentView == 'provider' ? providerSelected?.name : institutionSelected?.name}
				/>
			</div>
		</div>
	);
};
