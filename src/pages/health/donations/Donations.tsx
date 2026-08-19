import { TableComponents } from "@/components/table/TableComponents"
import { HeaderPages } from "@/layout/header/Header.tsx"
import { DonationBody, IDonations } from "@/services/donations/donations.interface"
import { getProviders } from "@/services/provider/provider.service"
import { getStore } from "@/services/store/store.service"
import { getMedicine } from "@/services/medicine/medicine.service"
import { getInstitutions } from "@/services/institution/institution.service"
import { getInventory } from "@/services/inventory/inventory.service.ts"
import { useEffect, useMemo, useState } from "react"
import { BiDonateHeart } from "react-icons/bi"
import { detDonationsColumns, donationsColumns } from "./donations.data.tsx"
import { debounce } from "@/lib/debounce"
import { Button } from "@/components/ui/button"
import { DonationsForm } from "./DonationsForm"
import PageTransitionComponent from "@/components/PageTransition"
import { Plus } from "lucide-react"
import { IProviders } from "@/services/provider/provider.interface"
import { IStore, StoreContent } from "@/services/store/store.interface"
import { IMedicine } from "@/services/medicine/medicine.interface"
import { IInstitution } from "@/services/institution/institution.interface"
import { DonationFilterDropDown } from "./DonationFilters"
import { IInventory } from "@/services/inventory/inventory.interface.ts"
import { useDonationsQuery, useLotesQuery, useCreateDonationMutation, useUpdateDonationMutation } from "./donations.hook"
import { useDonationStore } from "./donationStore"

export const Donations = () => {
  const [donationSelected, setDonationSelected] = useState<IDonations | null>(null)
  const [providers, setProviders] = useState<IProviders[]>([])
  const [institutions, setInstitutions] = useState<IInstitution[]>([])
  const [stores, setStores] = useState<IStore[]>([])
  const [medicines, setMedicines] = useState<IMedicine[]>([])
  const [inventory, setInventory] = useState<IInventory[]>([])
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const { page, size, setPage, setSize, filters, setFilter } = useDonationStore()
  const { data: donationsData, isFetching } = useDonationsQuery()
  const { data: lotesData } = useLotesQuery()
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

  useEffect(() => {
    Promise.all([
      getStoresApi(),
      getProvidersApi(),
      getMedicinesApi(),
      getInventoryApi(),
      getInstitutionsApi(),
    ]);
  }, [])

  const getProvidersApi = async () => {
    try {
      const response = await getProviders()
      setProviders(response.providers)
    } catch (err) {
      console.log(err)
    }
  }
  const getInstitutionsApi = async () => {
    try {
      const response = await getInstitutions()
      setInstitutions(response.institutions)
    } catch (err) {
      console.log(err)
    }
  }

  const getStoresApi = async () => {
    try {
      const response: StoreContent = await getStore()
      setStores(response.stores)
    } catch (err) {
      console.log(err)
    }
  }

  const getMedicinesApi = async () => {
    try {
      const response = await getMedicine()
      setMedicines(response.medicines)
    } catch (err) {
      console.log(err)
    }
  }

  const getInventoryApi = async () => {
    try {
      const response = await getInventory()
      setInventory(response.inventory)
    } catch (err) {
      console.log(err)
    }
  }

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
              providers={providers}
              institutions={institutions}
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
            providers={providers}
            stores={stores}
            inventory={inventory}
            medicines={medicines}
            institutions={institutions}
            onSave={handleSaveDonation}
            onCancel={handleCloseDialog} />
        </div>
      </PageTransitionComponent>
    </div>
  )
}