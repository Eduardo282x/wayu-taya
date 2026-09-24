import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDonationsCertificateDownload, getDonationsNormalDownloadReport, getDonationsNoteDeliveryDownload } from "@/services/donations/donations.service"

interface DonationDownloadMenuProps {
  donationId: number;
  controlNumber: string | number | undefined;
}

type DownloadType = 'factura' | 'nota' | 'certificado';

export const DonationDownloadMenu = ({ donationId, controlNumber }: DonationDownloadMenuProps) => {
  const [downloading, setDownloading] = useState<DownloadType | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const labels: Record<DownloadType, string> = {
    factura: 'Factura no comercial',
    nota: 'Nota de entrega',
    certificado: 'Certificado de donación',
  };

  const downloadFile = async (type: DownloadType) => {
    setDownloading(type);
    try {
      let response;
      switch (type) {
        case 'factura':
          response = await getDonationsNormalDownloadReport(donationId);
          break;
        case 'nota':
          response = await getDonationsNoteDeliveryDownload(donationId);
          break;
        case 'certificado':
          response = await getDonationsCertificateDownload(donationId);
          break;
      };
      const url = URL.createObjectURL(response);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${labels[type]} - ${controlNumber}`;
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
    <>
      {downloading !== null && <ScreenLoader />}
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
        <DropdownMenuItem disabled={downloading !== null} onClick={() => downloadFile('certificado')}>
          {downloading === 'certificado' ? 'Descargando...' : 'Certificado de donación'}
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}