import { useState } from "react"
import toast from "react-hot-toast"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
  StyledDialogFooter,
} from "@/components/StyledDialog/StyledDialog"
import { getDonationsCertificateDownload, getDonationsNormalDownloadReport, getDonationsNoteDeliveryDownload } from "@/services/donations/donations.service"

interface DonationDownloadMenuProps {
  donationId: number;
  controlNumber: string | number | undefined;
}

type DownloadType = 'factura' | 'nota' | 'certificado';

interface Preview {
  url: string;
  label: string;
}

export const DonationDownloadMenu = ({ donationId, controlNumber }: DonationDownloadMenuProps) => {
  const [downloading, setDownloading] = useState<DownloadType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<Preview | null>(null);

  const labels: Record<DownloadType, string> = {
    factura: 'Factura no comercial',
    nota: 'Nota de entrega',
    certificado: 'Certificado de donación',
  };

  const fetchFile = async (type: DownloadType) => {
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
      if (!response || response.size === 0) {
        toast.error(`No se pudo generar ${labels[type]}. Intenta de nuevo.`, {
          duration: 4000,
          position: 'top-right'
        });
        return;
      }
      if (preview) {
        URL.revokeObjectURL(preview.url);
      }
      const url = URL.createObjectURL(response);
      setPreview({ url, label: `${labels[type]} - ${controlNumber}` });
    } catch {
      toast.error(`No se pudo generar ${labels[type]}. Intenta de nuevo.`, {
        duration: 4000,
        position: 'top-right'
      });
    } finally {
      setDownloading(null);
      setOpen(false);
    }
  }

  const handleDownload = () => {
    if (!preview) return;
    const link = window.document.createElement("a");
    link.href = preview.url;
    link.download = preview.label;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  }

  const handleClosePreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  }

  return (
    <>
      {downloading !== null && <ScreenLoader />}
      <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="border border-[#0250b0] text-[#0250b0]">
          <Download size={16} />
          Descargar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={downloading !== null} onClick={() => fetchFile('factura')}>
          {downloading === 'factura' ? 'Descargando...' : 'Factura no comercial'}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={downloading !== null} onClick={() => fetchFile('nota')}>
          {downloading === 'nota' ? 'Descargando...' : 'Nota de entrega'}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={downloading !== null} onClick={() => fetchFile('certificado')}>
          {downloading === 'certificado' ? 'Descargando...' : 'Certificado de donación'}
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
      </div>

      <StyledDialog open={preview !== null} onOpenChange={(openDialog) => { if (!openDialog) handleClosePreview(); }}>
        <StyledDialogContent className="sm:max-w-4xl max-w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-hidden bg-gray-100">
          <StyledDialogHeader>
            <StyledDialogTitle>Vista previa del documento</StyledDialogTitle>
            <StyledDialogDescription>{preview?.label}</StyledDialogDescription>
          </StyledDialogHeader>
          <div className="flex-1 min-h-0 bg-white rounded-md border overflow-hidden">
            <iframe
              src={preview?.url}
              title={preview?.label}
              className="w-full h-[65vh]"
            />
          </div>
          <StyledDialogFooter>
            <Button variant="outline" className="border-[#0250b0] text-[#0250b0]" onClick={handleClosePreview}>
              Cerrar
            </Button>
            <Button className="bg-[#0250b0] hover:bg-[#0250b0]" onClick={handleDownload}>
              <Download size={16} />
              Descargar
            </Button>
          </StyledDialogFooter>
        </StyledDialogContent>
      </StyledDialog>
    </>
  )
}