import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { TableComponents } from "@/components/table/TableComponents";
import { HeaderPages } from "@/pages/layout/Header";
import { GroupDonations, IDonations } from "@/services/donations/donations.interface";
import { getDonations, getDonationsReport } from "@/services/donations/donations.service";
import { useEffect, useState } from "react";
import { BiDonateHeart } from "react-icons/bi";
import { detDonationsColumns, donationsColumns } from "./donations.data";
import { FilterComponent } from "@/components/table/FilterComponent";
import { Button } from "@/components/ui/button";
import { DonationsForm } from "./DonationsForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter";

export const Donations = () => {
  const [donations, setDonations] = useState<GroupDonations>({ allDonations: [], donations: [] })
  const [donationSelected, setDonationSelected] = useState<IDonations | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDonationsApi();
  }, []);

  const getDonationsApi = async () => {
    setLoading(true)
    try {
      const response: IDonations[] = await getDonations();
      setDonations({ allDonations: response, donations: response })
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  }

  const newDonations = () => {
    setDonationSelected(null);
    setOpenDialog(true);
  }

  const getActionTable = async (action: string, data: IDonations) => {
    setDonationSelected(data);

    if (action == 'edit') {
      setOpenDialog(true);
    }

    if (action == 'download') {
      setLoading(true);
      const response = await getDonationsReport(data.id);
      const url = URL.createObjectURL(response)
      const link = window.document.createElement("a")
      link.href = url
      link.download = `Reporte de donación`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setLoading(false);
    }
  }

  const setDonationFilter = (filteredDonation: IDonations[]) => {
    setDonations((prev) => ({ ...prev, donations: filteredDonation }));
  };


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
            {/* <GiMedicines className="size-6" /> */}
            Registrar Donación
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
              <TableComponents
                data={donations.detDonation}
                column={detDonationsColumns}
                actionTable={getActionTable}
              />
            </div>
            // <InventoryDetailsMedicine inventory={donations} key={index} />
          )}
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="">
          <DonationsForm donation={donationSelected} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
