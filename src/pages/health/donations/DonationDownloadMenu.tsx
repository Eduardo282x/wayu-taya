import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDonationsNormalDownloadReport, getDonationsNoteDeliveryDownload } from "@/services/donations/donations.service"

interface DonationDownloadMenuProps {
  donationId: number;
}

type DownloadType = 'factura' | 'nota';

export const DonationDownloadMenu = ({ donationId }: DonationDownloadMenuProps) => {
  const [downloading, setDownloading] = useState<DownloadType | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const downloadFile = async (type: DownloadType) => {
    setDownloading(type);
    try {
      const response = type === 'factura'
        ? await getDonationsNormalDownloadReport(donationId)
        : await getDonationsNoteDeliveryDownload(donationId);
      const url = URL.createObjectURL(response);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = type === 'factura' ? 'Factura no comercial.pdf' : 'Nota de entrega.pdf';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
      setOpen(false);
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="border border-[#0250b0] text-[#0250b0]">
          <Download size={16} />
          Descargar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={downloading !== null} onClick={() => downloadFile('factura')}>
          {downloading === 'factura' ? 'Descargando...' : 'Factura no comercial'}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={downloading !== null} onClick={() => downloadFile('nota')}>
          {downloading === 'nota' ? 'Descargando...' : 'Nota de entrega'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}