import { useEffect, useMemo, useState } from "react";
import { Column } from "@/components/table/table.interface";
import { FaPlus, FaUserTie } from "react-icons/fa";
import { IProviders, ProviderBody } from "@/services/provider/provider.interface";
import { HeaderPages } from "@/layout/header/Header";
import { FilterComponent } from "@/components/table/FilterComponent";
import { Button } from "@/components/ui/button";
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";
import { IInstitution, InstitutionsBody } from "@/services/institution/institution.interface";
import { TableComponents } from "@/components/table/TableComponents";
import { ProviderForm } from "./ProviderForm";
import { InstitutionForm } from "./InstitutionForm";
import { institutionColumns, providerColumns } from "./providerInstitution.data";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import PageTransitionComponent from "@/components/PageTransition";
import {
  useProvidersQuery,
  useInstitutionsQuery,
  useParishQuery,
  useCreateProviderMutation,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useCreateInstitutionMutation,
  useUpdateInstitutionMutation,
  useDeleteInstitutionMutation,
} from "./providers.hook";
import { useProvidersStore } from "./providersStore";

type view = 'provider' | 'institution';

export const ProvidersInstitutions = () => {
	const [columnsProviders, setColumnsProviders] = useState<Column[]>(providerColumns);
	const [columnsInstitutions, setColumnsInstitutions] = useState<Column[]>(institutionColumns);
	const [filteredProviders, setFilteredProviders] = useState<IProviders[]>([]);
	const [filteredInstitutions, setFilteredInstitutions] = useState<IInstitution[]>([]);
	const [currentView, setCurrentView] = useState<view>('provider');
	const [openDialogDelete, setOpenDialogDelete] = useState(false);
	const [openProvider, setOpenProvider] = useState(false);
	const [openInstitution, setOpenInstitution] = useState(false);
	const [providerSelected, setProviderSelected] = useState<IProviders | null>(null);
	const [institutionSelected, setInstitutionSelected] = useState<IInstitution | null>(null);

	const {
		providersPage, providersSize, setProvidersPage, setProvidersSize,
		institutionsPage, institutionsSize, setInstitutionsPage, setInstitutionsSize,
	} = useProvidersStore();
	const { data: providersData, isFetching: providersIsFetching } = useProvidersQuery();
	const { data: institutionsData, isFetching: institutionsIsFetching } = useInstitutionsQuery();
	const { data: parishData } = useParishQuery();
	const createProvider = useCreateProviderMutation();
	const updateProvider = useUpdateProviderMutation();
	const deleteProvider = useDeleteProviderMutation();
	const createInstitution = useCreateInstitutionMutation();
	const updateInstitution = useUpdateInstitutionMutation();
	const deleteInstitution = useDeleteInstitutionMutation();

	const currentProviders = useMemo(() => providersData?.providers ?? [], [providersData]);
	const totalProviders = providersData?.total ?? 0;
	const currentInstitutions = useMemo(() => institutionsData?.institutions ?? [], [institutionsData]);
	const totalInstitutions = institutionsData?.total ?? 0;

	useEffect(() => {
		setFilteredProviders(currentProviders);
	}, [currentProviders]);

	useEffect(() => {
		setFilteredInstitutions(currentInstitutions);
	}, [currentInstitutions]);

	const tabSelected = (tab: view): string => {
		if (tab == currentView) {
			return 'w-40 bg-gradient-to-r from-blue-800 to-[#58c0e9] text-white'
		}
		return 'w-40 bg-white text-gray-700'
	}
	const changeTab = (tab: view) => {
		setCurrentView(tab)
	}

	const setFilter = (data: IProviders[] | IInstitution[]) => {
		if (currentView == 'provider') setFilteredProviders(data as IProviders[])
		if (currentView == 'institution') setFilteredInstitutions(data as IInstitution[])
	}

	const newElement = () => {
		setProviderSelected(null);
		setInstitutionSelected(null);
		if (currentView == 'provider') setOpenProvider(true);
		if (currentView == 'institution') setOpenInstitution(true);
	}

	const getActionForm = async (data: ProviderBody | InstitutionsBody) => {
		try {
			if (providerSelected || institutionSelected) {
				if (currentView == 'provider') await updateProvider.mutateAsync({ id: Number(providerSelected?.id), data: data as ProviderBody })
				if (currentView == 'institution') await updateInstitution.mutateAsync({ id: Number(institutionSelected?.id), data: data as InstitutionsBody })
			} else {
				if (currentView == 'provider') await createProvider.mutateAsync(data as ProviderBody)
				if (currentView == 'institution') await createInstitution.mutateAsync(data as InstitutionsBody)
			}
		} catch (err) {
			console.log(err);
		}

		setOpenInstitution(false);
		setOpenProvider(false);
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
		try {
			if (currentView == 'provider') await deleteProvider.mutateAsync(Number(providerSelected?.id))
			if (currentView == 'institution') await deleteInstitution.mutateAsync(Number(institutionSelected?.id))
		} catch (err) {
			console.log(err);
		}

		setOpenDialogDelete(false);
	};

	return (
		<div className='px-3 lg:p-0 h-full flex flex-col'>
			<PageTransitionComponent toggle={openProvider || openInstitution}>
				<div className="h-full overflow-auto">
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
							{currentView == 'provider' && (
								<DropdownColumnFilter columns={columnsProviders} setColumns={setColumnsProviders} />
							)}
							{currentView == 'institution' && (
								<DropdownColumnFilter columns={columnsInstitutions} setColumns={setColumnsInstitutions} />
							)}

							<FilterComponent
								data={currentView == 'provider' ? currentProviders : currentInstitutions}
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
						{currentView == 'provider' && (
							<TableComponents
								data={filteredProviders}
								column={columnsProviders.filter(col => col.visible == true)}
								actionTable={getActionTable}
								totalItems={totalProviders}
								page={providersPage}
								onPageChange={setProvidersPage}
								rowsPerPage={providersSize}
								onRowsPerPageChange={setProvidersSize}
								loading={providersIsFetching}
							/>
						)}

						{currentView == 'institution' && (
							<TableComponents
							data={filteredInstitutions}
								column={columnsInstitutions.filter(col => col.visible == true)}
								actionTable={getActionTable}
								totalItems={totalInstitutions}
								page={institutionsPage}
								onPageChange={setInstitutionsPage}
								rowsPerPage={institutionsSize}
								onRowsPerPageChange={setInstitutionsSize}
								loading={institutionsIsFetching}
							/>
						)}
					</div>

					<ConfirmDeleteDialog
						open={openDialogDelete}
						onOpenChange={setOpenDialogDelete}
						onConfirm={confirmDelete}
						name={currentView == 'provider' ? providerSelected?.name : institutionSelected?.name}
					/>
				</div>

				<div className="h-full px-2">
					<div className={openInstitution ? "hidden" : "h-full"}>
						<ProviderForm
							open={openProvider}
							onOpenChange={setOpenProvider}
							provider={providerSelected}
							onSubmit={getActionForm}
						/>
					</div>
					<div className={openProvider ? "hidden" : "h-full"}>
						<InstitutionForm
							open={openInstitution}
							onOpenChange={setOpenInstitution}
							institution={institutionSelected}
							onSubmit={getActionForm}
							parish={parishData?.parishes ?? []}
						/>
					</div>
				</div>
			</PageTransitionComponent>
		</div>
	);
};
