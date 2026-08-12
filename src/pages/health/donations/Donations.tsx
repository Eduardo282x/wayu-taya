import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { TableComponents } from "@/components/table/TableComponents"
import { HeaderPages } from "@/layout/header/Header.tsx"
import { DonationBody, DonationsContent, IDonations } from "@/services/donations/donations.interface"
import { getDonations, getDonationsReport, getLotes, postDonation, putDonation } from "@/services/donations/donations.service"
import { useEffect, useRef, useState } from "react"
import { BiDonateHeart } from "react-icons/bi"
import { detDonationsColumns, donationsColumns, IDonationsFilters } from "./donations.data.tsx"
import { FilterComponent } from "@/components/table/FilterComponent"
import { Button } from "@/components/ui/button"
import { DonationsForm } from "./DonationsForm"
import PageTransitionComponent from "@/components/PageTransition"
import { Plus } from "lucide-react"
import { IProviders } from "@/services/provider/provider.interface"
import { getProviders } from "@/services/provider/provider.service"
import { getStore } from "@/services/store/store.service"
import { IStore, StoreContent } from "@/services/store/store.interface"
import { getMedicine } from "@/services/medicine/medicine.service"
import { IMedicine } from "@/services/medicine/medicine.interface"
import { IInstitution } from "@/services/institution/institution.interface"
import { getInstitutions } from "@/services/institution/institution.service"
import { DonationFilterDropDown } from "./DonationFilters"
import { IInventory } from "@/services/inventory/inventory.interface.ts"
import { getInventory } from "@/services/inventory/inventory.service.ts"

export const Donations = () => {
  const [donations, setDonations] = useState<DonationsContent>({ donations: [] })
  const [donationSelected, setDonationSelected] = useState<IDonations | null>(null)
  const [providers, setProviders] = useState<IProviders[]>([])
  const [institutions, setInstitutions] = useState<IInstitution[]>([])
  const [stores, setStores] = useState<IStore[]>([])
  const [medicines, setMedicines] = useState<IMedicine[]>([])
  const [inventory, setInventory] = useState<IInventory[]>([])
  const [lotes, setLotes] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [donationsFilter, setDonationsFilter] = useState<IDonationsFilters>({
    type: 'all',
    lote: '',
    providerId: null,
    institutionId: null,
  })
  const filterAppliedRef = useRef<string>('');

  useEffect(() => {
    Promise.all([
      getStoresApi(),
      getDonationsApi(),
      getProvidersApi(),
      getMedicinesApi(),
      getInventoryApi(),
      getInstitutionsApi(),
      getLotesApi(),
    ]);
  }, [])

  const getLotesApi = async () => {
    try {
      const response = await getLotes()
      setLotes(response.lotes);
    } catch (err) {
      console.log(err)
    }
  }
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

  const getDonationsApi = async () => {
    setLoading(true)
    try {
      const response: DonationsContent = await getDonations()
      setDonations(response)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
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

    if (action == "download") {
      setLoading(true)
      const response = await getDonationsReport(data.id)
      const url = URL.createObjectURL(response)
      const link = window.document.createElement("a")
      link.href = url
      link.download = `Reporte de donación`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setLoading(false)
    }
  }

  const setDonationFilter = (filteredDonation: IDonations[]) => {
    setDonations((prev) => ({ ...prev, donations: filteredDonation }))
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDonationSelected(null);
  }

  const handleSaveDonation = async (donationData: DonationBody): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);

    const response = donationSelected?.id
      ? await putDonation(donationSelected.id, donationData)
      : await postDonation(donationData);

    if (!response.success) {
      setLoading(false);
      return { success: false, message: response.message };
    }

    handleCloseDialog();
    getDonationsApi();
    return { success: true };
  }

  useEffect(() => {
    const filterKey = JSON.stringify(donationsFilter);
    if (filterAppliedRef.current === filterKey) return;
    filterAppliedRef.current = filterKey;

    const filteredDonations = donations.donations.filter((donation) => {
      const matchesType = donationsFilter.type === 'all' || donation.type === donationsFilter.type;
      const matchesLote = donationsFilter.lote === 'all' || donation.lote.toLowerCase().includes(donationsFilter.lote.toLowerCase());
      const matchesProvider = donationsFilter.providerId ? donation.providerId === donationsFilter.providerId : true;
      const matchesInstitution = donationsFilter.institutionId ? donation.institutionId === donationsFilter.institutionId : true;

      return matchesType && matchesLote && matchesProvider && matchesInstitution;
    });

    setDonations((prev) => ({ ...prev, donations: filteredDonations }));
  }, [donations.donations, donationsFilter])

  const handleDonationFilterChange = (filter: string, value: string | number) => {
    if (filter === 'type') {
      setDonationsFilter((prev) => ({ ...prev, type: value as 'Entrada' | 'Salida' }));
    } else if (filter === 'lote') {
      setDonationsFilter((prev) => ({ ...prev, lote: value.toString() }));
    } else if (filter === 'providerId') {
      setDonationsFilter((prev) => ({ ...prev, providerId: value ? Number(value) : null }));
    } else if (filter === 'institutionId') {
      setDonationsFilter((prev) => ({ ...prev, institutionId: value ? Number(value) : null }));
    }
  }

  const cleanFilters = () => {
    setDonationsFilter({
      type: 'all',
      lote: '',
      providerId: null,
      institutionId: null,
    })
  }

  return (
    <div className='px-3 lg:p-0 h-full flex flex-col'>
      {loading && (
        <ScreenLoader />
      )}
      <PageTransitionComponent toggle={openDialog}>
        <div className="h-full ">
          <HeaderPages title="Donaciones" Icon={BiDonateHeart} />

          <div className="flex justify-between items-center px-2 pb-2 pt-1 border-b-2 border-gray-300">
            <DonationFilterDropDown
              providers={providers}
              institutions={institutions}
              handleDonationFilterChange={handleDonationFilterChange}
              cleanFilters={cleanFilters}
              lotes={lotes}
            />
            <div className="flex items-center ">
              <FilterComponent
                data={donations.donations}
                columns={donationsColumns}
                placeholder="Buscar donación..."
                setDataFilter={setDonationFilter}
              />
              <Button variant={"animated"} className="h-full" onClick={newDonations}>
                <Plus className="w-4 h-4 mr-1" />
                Agregar Donación
              </Button>

            </div>
          </div>

          <div className="mt-3">
            <TableComponents
              data={donations.donations}
              column={donationsColumns}
              actionTable={getActionTable}
              colSpanColumns={true}
              isExpansible={true}
              renderRow={(donations: IDonations, index: number) => (
                <div key={index} className="max-h-100 overflow-y-auto w-full">
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
