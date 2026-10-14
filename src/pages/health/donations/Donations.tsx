import { TableComponents } from "@/components/table/TableComponents"
import { HeaderPages } from "@/layout/header/Header.tsx"
import { DonationBody, IDonations } from "@/services/donations/donations.interface"
import { useEffect, useMemo, useState } from "react"
import { BiDonateHeart } from "react-icons/bi"
import { detDonationsColumns, donationsColumns } from "./donations.data.tsx"
import { debounce } from "@/lib/debounce"
import { Button } from "@/components/ui/button"
import { DonationsForm } from "./DonationsForm"
import PageTransitionComponent from "@/components/PageTransition"
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react"
import { DonationFilterDropDown } from "./DonationFilters"
import { DonationDownloadMenu } from "./DonationDownloadMenu"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/utils/formatters"
import { formatNumberWithDots } from "@/hooks/formaters"
import { useDonationsQuery, useLotesQuery, useDonationsSummaryQuery, useCreateDonationMutation, useUpdateDonationMutation, useDeleteDonationMutation } from "./donations.hook"
import { useDonationStore } from "./donationStore"
import { useStoresQuery } from "@/pages/health/store/store.hook"
import { useAllInventoryQuery } from "@/pages/health/inventory/inventory.hook"
import { useAllMedicinesQuery } from "@/pages/health/medicine/medicine.hook"
import { useAllProvidersQuery, useAllInstitutionsQuery } from "@/pages/documents/providers/providers.hook"
import { DonationInventoryWarningDialog } from "./DonationInventoryWarningDialog"
import { DonationSummaryPopover } from "./DonationSummaryPopover"

export const Donations = () => {
  const [donationSelected, setDonationSelected] = useState<IDonations | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  const { page, size, setPage, setSize, filters, setFilter } = useDonationStore()
  const { data: donationsData, isPending } = useDonationsQuery()
  const { data: summaryData, isPending: summaryPending } = useDonationsSummaryQuery()
  const { data: lotesData } = useLotesQuery()
  const { data: storesData } = useStoresQuery(openDialog || deleteWarningOpen)
  const { data: allInventoryData } = useAllInventoryQuery(openDialog)
  const { data: allMedicinesData } = useAllMedicinesQuery(openDialog)
  const { data: allProvidersData } = useAllProvidersQuery()
  const { data: allInstitutionsData } = useAllInstitutionsQuery()
  const createDonation = useCreateDonationMutation()
  const updateDonation = useUpdateDonationMutation()
  const deleteDonation = useDeleteDonationMutation()

  const currentDonations = donationsData?.donations ?? []
  const totalDonations = donationsData?.pagination?.total ?? 0

  // La columna de descarga solo aplica a Salida. Predicado booleano explicito:
  // antes se devolvia el objeto columna (truthy) en la rama else.
  const visibleColumns = donationsColumns.filter((column) =>
    filters.type === 'Entrada' ? !column.column.includes('download') : true,
  )

  const [searchControl, setSearchControl] = useState<string>(filters.controlNumber)

  const debouncedControlNumber = useMemo(
    () => debounce((value: string) => setFilter('controlNumber', value), 300),
    []
  )

  useEffect(() => {
    setSearchControl(filters.controlNumber)
  }, [filters.controlNumber])

  const newDonations = () => {
    setDonationSelected(null)
    setOpenDialog(true)
  }

  const getActionTable = async (action: string, data: IDonations) => {
    setDonationSelected(data)

    if (action == "edit") {
      setOpenDialog(true)
    }

    if (action == "delete") {
      setDeleteWarningOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDonationSelected(null);
  }

  const handleCloseDeleteWarning = () => {
    setDeleteWarningOpen(false);
    setDonationSelected(null);
  }

  const handleConfirmDeleteDonation = async () => {
    if (!donationSelected) return;

    setDeleting(true);
    try {
      const response = await deleteDonation.mutateAsync(donationSelected.id);

      // El interceptor ya notifica exito/error. Cerrar solo en exito.
      if (!response.success) return;

      setDeleteWarningOpen(false);
      setDonationSelected(null);
    } catch {
      // El interceptor notifica el error; el dialogo permanece abierto.
    } finally {
      setDeleting(false);
    }
  }

  const handleSaveDonation = async (donationData: DonationBody): Promise<{ success: boolean; message?: string }> => {
    try {
      let response;
      if (donationSelected?.id) {
        response = await updateDonation.mutateAsync({ id: donationSelected.id, data: donationData });
      } else {
        response = await createDonation.mutateAsync(donationData);
      }

      if (!response.success) {
        return { success: false, message: response.message };
      }

      handleCloseDialog();
      return { success: true };
    } catch {
      return { success: false, message: 'Error inesperado al guardar la donación.' };
    }
  }

  return (
    <div className='px-2 lg:p-0 h-full flex flex-col'>
      <PageTransitionComponent toggle={openDialog}>
        <div className="h-full flex flex-col min-h-0">
          <HeaderPages title="Donaciones" Icon={BiDonateHeart} />

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 p-2 lg:mx-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <DonationFilterDropDown
              providers={allProvidersData?.providers ?? []}
              institutions={allInstitutionsData?.institutions ?? []}
              lotes={lotesData?.lotes ?? []}
            />
            <div className="flex flex-col lg:flex-row items-end gap-1 w-full lg:w-auto">
              <input
                type="search"
                placeholder="Buscar donación..."
                className="flex-1 min-w-0 lg:flex-none w-full lg:w-60 focus:outline-0 shadow-2xl border border-gray-400 bg-white rounded-lg h-9 placeholder:opacity-60 p-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 100s"
                value={searchControl}
                onChange={(e) => {
                  setSearchControl(e.target.value)
                  debouncedControlNumber(e.target.value)
                }}
              />
              <div className="flex items-center justify-between w-full gap-2">
                <DonationSummaryPopover data={summaryData} isLoading={summaryPending} />
                <Button variant={"animated"} className="w-1/2 lg:w-auto h-9 whitespace-nowrap" onClick={newDonations}>
                  <Plus className="w-4 h-4" />
                  Donación
                </Button>
              </div>

            </div>
          </div>

          <div className="lg:mx-2 mt-3 flex-1 min-h-0 flex flex-col">
            <div className="hidden lg:flex flex-1 min-h-0 flex-col">
              <TableComponents
                data={currentDonations}
                column={visibleColumns}
                actionTable={getActionTable}
                colSpanColumns={true}
                isExpansible={true}
                totalItems={totalDonations}
                page={page}
                onPageChange={setPage}
                rowsPerPage={size}
                onRowsPerPageChange={setSize}
                loading={isPending}
                renderRow={(donations: IDonations) => (
                  <div key={donations.id} className="w-full [&_.table-shell]:max-h-none [&_.table-shell]:min-h-0">
                    <TableComponents data={donations.detDonation} column={detDonationsColumns} actionTable={getActionTable} />
                  </div>
                )}
              />
            </div>

            <div className="lg:hidden flex flex-col gap-2">
              <DonationsMobileList
                donations={currentDonations}
                loading={isPending}
                actionTable={getActionTable}
                page={page}
                size={size}
                totalItems={totalDonations}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        <div className="h-full px-2">
          <DonationsForm
            key={openDialog ? `donation-form-${donationSelected?.id ?? 'new'}` : 'donation-form-idle'}
            donation={donationSelected}
            providers={allProvidersData?.providers ?? []}
            stores={storesData?.stores ?? []}
            inventory={allInventoryData?.inventory ?? []}
            medicines={allMedicinesData?.medicines ?? []}
            institutions={allInstitutionsData?.institutions ?? []}
            onSave={handleSaveDonation}
            onCancel={handleCloseDialog} />
        </div>
      </PageTransitionComponent>

      <DonationInventoryWarningDialog
        open={deleteWarningOpen}
        onOpenChange={(open) => { if (!open) handleCloseDeleteWarning(); }}
        mode="delete"
        donation={donationSelected}
        stores={storesData?.stores ?? []}
        loading={deleting}
        onConfirm={handleConfirmDeleteDonation}
      />
    </div>
  )
}

interface DonationsMobileListProps {
  donations: IDonations[];
  loading?: boolean;
  actionTable: (action: string, data: IDonations) => void;
  page: number;
  size: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const DonationsMobileList = ({ donations, loading, actionTable, page, size, totalItems, onPageChange }: DonationsMobileListProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / (size || 1)));

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!donations.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No se encontraron datos.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {donations.map((donation) => (
        <DonationMobileCard key={donation.id} donation={donation} actionTable={actionTable} />
      ))}

      <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
        <span className="text-gray-600">
          <span className="font-semibold">Total:</span> {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="whitespace-nowrap text-gray-600">
            Página {Math.min(page + 1, totalPages)} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface DonationMobileCardProps {
  donation: IDonations;
  actionTable: (action: string, data: IDonations) => void;
}

const DonationMobileCard = ({ donation, actionTable }: DonationMobileCardProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const isEntry = donation.type === 'Entrada';
  const counterparty = isEntry ? donation.provider?.name : donation.institution?.name;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">N° Control</p>
            <p className="truncate font-semibold text-gray-800">
              {donation.controlNumber ? String(donation.controlNumber) : '-'}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${isEntry ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {donation.type}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div className="col-span-2 min-w-0">
            <p className="text-xs text-gray-500">{isEntry ? 'Proveedor' : 'Institución'}</p>
            <p className="truncate text-gray-800">{counterparty || '-'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Lote</p>
            <p className="truncate text-gray-800">{donation.lote || '-'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Fecha</p>
            <p className="truncate text-gray-800">{formatDate(donation.date)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-gray-100 px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 text-blue-800 hover:text-blue-900"
          onClick={() => actionTable('edit', donation)}
        >
          <Pencil className="w-4 h-4 mr-1" /> Editar
        </Button>
        {!isEntry && (
          <div className="flex-1 [&_button]:w-full">
            <DonationDownloadMenu donationId={donation.id} controlNumber={donation.controlNumber} />
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => actionTable('delete', donation)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Eliminar
        </Button>
      </div>

      {donation.detDonation?.length > 0 && (
        <>
          <Button
            type="button"
            variant="ghost"
            className="w-full rounded-none border-t border-gray-100 text-gray-600"
            onClick={() => setOpen(!open)}
          >
            <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${open ? 'rotate-180' : ''}`} />
            {open ? 'Ocultar detalles' : `Ver detalles (${donation.detDonation.length})`}
          </Button>

          {open && (
            <div className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
              {donation.detDonation.map((det) => (
                <div key={det.id} className="p-3 text-sm border-b-blue-800 border-b-2">
                  <p className="font-medium text-gray-800">
                    {det.medicine.name} {det.medicine.presentation}
                  </p>
                  <div className="mt-1 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Cantidad</p>
                      <p className="font-medium text-gray-800">{formatNumberWithDots(det.amount)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500">Lote</p>
                      <p className="truncate font-medium text-gray-800">{det.lote || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expira</p>
                      <p className="font-medium text-gray-800">{formatDate(det.expirationDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};