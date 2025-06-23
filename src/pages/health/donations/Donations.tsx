import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { TableComponents } from "@/components/table/TableComponents"
import { HeaderPages } from "@/pages/layout/Header"
import type { GroupDonations, IDonations } from "@/services/donations/donations.interface"
import { getDonations, getDonationsReport } from "@/services/donations/donations.service"
import { useEffect, useState } from "react"
import { BiDonateHeart } from "react-icons/bi"
import { detDonationsColumns, donationsColumns } from "./donations.data"
import { FilterComponent } from "@/components/table/FilterComponent"
import { Button } from "@/components/ui/button"
import { DonationsForm } from "./DonationsForm"
import { StyledDialog, StyledDialogContent, StyledDialogHeader, StyledDialogTitle } from "@/components/StyledDialog/StyledDialog"
import { Plus } from "lucide-react"
import { IProviders } from "@/services/provider/provider.interface"
import { getProviders } from "@/services/provider/provider.service"
import { getStore } from "@/services/store/store.service"
import { IStore } from "@/services/store/store.interface"
import { getMedicine } from "@/services/medicine/medicine.service"
import { IMedicine } from "@/services/medicine/medicine.interface"
import { IInstitution } from "@/services/institution/institution.interface"
import { getInstitutions } from "@/services/institution/institution.service"

export const Donations = () => {
  const [donations, setDonations] = useState<GroupDonations>({ allDonations: [], donations: [] })
  const [donationSelected, setDonationSelected] = useState<IDonations | null>(null)
  const [providers, setProviders] = useState<IProviders[]>([])
  const [institutions, setInstitutions] = useState<IInstitution[]>([])
  const [stores, setStores] = useState<IStore[]>([])
  const [medicines, setMedicines] = useState<IMedicine[]>([])
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getDonationsApi()
    getProvidersApi()
    getStoresApi()
    getMedicinesApi()
    getInstitutionsApi()
  }, [])

  const getProvidersApi = async () => {
    try {
      const response: IProviders[] = await getProviders()
      setProviders(response)
    } catch (err) {
      console.log(err)
    }
  }
  const getInstitutionsApi = async () => {
    try {
      const response: IInstitution[] = await getInstitutions()
      setInstitutions(response)
    } catch (err) {
      console.log(err)
    }
  }

  const getStoresApi = async () => {
    try {
      const response: IStore[] = await getStore()
      setStores(response)
    } catch (err) {
      console.log(err)
    }
  }

  const getMedicinesApi = async () => {
    try {
      const response: IMedicine[] = await getMedicine()
      setMedicines(response)
    } catch (err) {
      console.log(err)
    }
  }

  const getDonationsApi = async () => {
    setLoading(true)
    try {
      const response: IDonations[] = await getDonations()
      setDonations({ allDonations: response, donations: response })
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
    setOpenDialog(false)
    setDonationSelected(null)
  }

  const handleSaveDonation = () => {
    // Aquí puedes agregar la lógica para guardar la donación
    handleCloseDialog()
    getDonationsApi() // Refrescar la lista
  }

  return (
    <div className="min-h-[90vh] w-[79.5vw] pr-7 overflow-auto">
      {loading && <ScreenLoader />}
      <HeaderPages title="Donaciones" Icon={BiDonateHeart} />

      <div className="flex justify-end items-center px-2 pb-2 pt-1 h-fit border-b-2 border-gray-300">
        <div className="flex items-center ">
          <FilterComponent
            data={donations.allDonations}
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
            <div key={index} className="max-h-32">
              <TableComponents data={donations.detDonation} column={detDonationsColumns} actionTable={getActionTable} />
            </div>
          )}
        />
      </div>


      <StyledDialog open={openDialog} onOpenChange={setOpenDialog}>
        <StyledDialogContent className="w-[60rem] max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <StyledDialogHeader>
            <StyledDialogTitle>{donationSelected ? "Editar Donación" : "Registrar Nueva Donación"}</StyledDialogTitle>
          </StyledDialogHeader>
          <DonationsForm
            donation={donationSelected}
            providers={providers}
            stores={stores}
            medicines={medicines}
            institutions={institutions}
            onSave={handleSaveDonation}
            onCancel={handleCloseDialog} />
        </StyledDialogContent>
      </StyledDialog>
    </div>
  )
}
