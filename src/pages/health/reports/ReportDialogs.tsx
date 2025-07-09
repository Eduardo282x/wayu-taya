import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2"
import {
    StyledDialog,
    StyledDialogContent,
    StyledDialogHeader,
    StyledDialogTitle,
    StyledDialogDescription,
} from "@/components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button";
import { ReportDonations } from "@/services/reports/report.interface";
import { useState } from "react";

interface ReportDialogsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    provider: { provider: string, id: number }[];
    lotes: string[]
    onSubmitData: (data: ReportDonations) => void
}


export const ReportDialogs = ({ open, setOpen, provider, lotes, onSubmitData }: ReportDialogsProps) => {
    const [providerSelected, setProviderSelected] = useState<string>('');
    const [lotesSelected, setLotesSelected] = useState<string[]>([]);

    const onSubmit = () => {
        const data = {
            provider: providerSelected,
            lotes: lotesSelected,
        }
        onSubmitData(data);
    }

    const setLotes = (value: string) => {

        const loteArray = lotesSelected.find(item => item == value)
            ? lotesSelected.filter(pro => pro != value)
            : [...lotesSelected, value]

        setLotesSelected(loteArray)
    }

    return (
        <StyledDialog open={open} onOpenChange={setOpen}>
            <StyledDialogContent className="w-[30rem] ">
                <StyledDialogHeader>
                    <StyledDialogTitle>Generar Reporte</StyledDialogTitle>
                    <StyledDialogDescription>
                        Seleccionar el proveedor y los lotes
                    </StyledDialogDescription>
                </StyledDialogHeader>
                <div className="grid gap-4 py-4">

                    <div>
                        <FormAutocompleteV2
                            label="Proveedor"
                            placeholder="Selecciona un proveedor"
                            data={provider.map(item => ({ label: item.provider, value: item.provider.toString() }))}
                            onChange={(value) => setProviderSelected(value)}
                        />
                    </div>
                    <div>
                        <FormAutocompleteV2
                            label="Lotes"
                            placeholder="Selecciona los lotes"
                            data={lotes.map(lo => ({
                                value: lo,
                                label: lo,
                            }))}
                            holdOpen={true}
                            onChange={(value) => setLotes(value)}
                            multiple={true}
                            dataSelected={lotesSelected.map(item => item.toString())}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="animated"
                            className="p-3 w-[25%] h-[90%] bg-gradient-to-r from-blue-800 to-[#58c0e9]"
                            type="submit"
                            onClick={onSubmit}
                        >
                            Generar
                        </Button>
                    </div>
                </div>
            </StyledDialogContent>
        </StyledDialog>
    )
}
