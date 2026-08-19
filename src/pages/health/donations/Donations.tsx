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
import { Plus } from "lucide-react"
import { DonationFilterDropDown } from "./DonationFilters"
import { useDonationsQuery, useLotesQuery, useCreateDonationMutation, useUpdateDonationMutation } from "./donations.hook"
import { useDonationStore } from "./donationStore"
import { useStoresQuery } from "@/pages/health/store/store.hook"
import { useAllInventoryQuery } from "@/pages/health/inventory/inventory.hook"
import { useAllMedicinesQuery } from "@/pages/health/medicine/medicine.hook"
import { useAllProvidersQuery, useAllInstitutionsQuery } from "@/pages/documents/providers/providers.hook"

export const Donations = () => {
  const [donationSelected, setDonationSelected] = useState<IDonations | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const { page, size, setPage, setSize, filters, setFilter } = useDonationStore()
  const { data: donationsData, isFetching } = useDonationsQuery()
  const { data: lotesData } = useLotesQuery()
  const { data: storesData } = useStoresQuery(openDialog)
  const { data: allInventoryData } = useAllInventoryQuery(openDialog)
  const { data: allMedicinesData } = useAllMedicinesQuery(openDialog)
  const { data: allProvidersData } = useAllProvidersQuery()
  const { data: allInstitutionsData } = useAllInstitutionsQuery()
  const createDonation = useCreateDonationMutation()
  const updateDonation = useUpdateDonationMutation()

  const currentDonations = donationsData?.donations ?? []
  const totalDonations = donationsData?.total ?? 0

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
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDonationSelected(null);
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
    <div className='px-3 lg:p-0 h-full flex flex-col'>
      <PageTransitionComponent toggle={openDialog}>
        <div className="h-full ">
          <HeaderPages title="Donaciones" Icon={BiDonateHeart} />

          <div className="flex justify-between items-end gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-200">
            <DonationFilterDropDown
              providers={allProvidersData?.providers ?? []}
              institutions={allInstitutionsData?.institutions ?? []}
              lotes={lotesData?.lotes ?? []}
            />
            <div className="flex items-end gap-2">
              <input
                type="search"
                placeholder="Buscar donación..."
                className="w-40 lg:w-60 focus:outline-0 shadow-2xl border-1 border-gray-400 bg-white rounded-lg h-9 placeholder:opacity-60 p-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 100s"
                value={searchControl}
                onChange={(e) => {
                  setSearchControl(e.target.value)
                  debouncedControlNumber(e.target.value)
                }}
              />
              <Button variant={"animated"} className="h-full" onClick={newDonations}>
                <Plus className="w-4 h-4" />
                Donación
              </Button>

            </div>
          </div>

          <div className="mt-3">
            <TableComponents
              data={currentDonations}
              column={donationsColumns}
              actionTable={getActionTable}
              colSpanColumns={true}
              isExpansible={true}
              totalItems={totalDonations}
              page={page}
              onPageChange={setPage}
              rowsPerPage={size}
              onRowsPerPageChange={setSize}
              loading={isFetching}
              renderRow={(donations: IDonations, index: number) => (
                <div key={index} className="w-full [&_.table-shell]:max-h-none [&_.table-shell]:min-h-0">
                  <TableComponents data={donations.detDonation} column={detDonationsColumns} actionTable={getActionTable} />
                </div>
              )}
            />
          </div>
        </div>

        <div className="h-full px-2">
          <DonationsForm
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
    </div>
  )
}