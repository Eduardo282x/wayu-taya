import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  medicineName?: string;
}

const ConfirmDeleteMedicineDialog: React.FC<
  ConfirmDeleteMedicineDialogProps
> = ({
  open,
  onOpenChange,
  onConfirm,
  medicineName, // Usamos medicineName
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirmar eliminación de medicamento</DialogTitle>{" "}
          <DialogDescription className="text-gray-800 text-lg">
            ¿Estás seguro de que quieres eliminar el medicamento{" "}
            {medicineName ? `"${medicineName}"` : "seleccionado"}? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteMedicineDialog;
