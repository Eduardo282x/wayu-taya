
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    name?: string;
    isLoading?: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    open,
    onOpenChange,
    onConfirm,
    name,
    isLoading = false,
}) => {
    return (
        <Dialog open={open} onOpenChange={(value) => { if (!isLoading) onOpenChange(value); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que quieres eliminar {name ? `"${name}"` : "este usuario"}? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => onConfirm()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="size-4 animate-spin" /> Eliminando...
                            </>
                        ) : (
                            "Eliminar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
