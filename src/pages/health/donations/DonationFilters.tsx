import { FormAutocompleteV2 } from '@/components/formInput/FormAutoCompleteCustomV2';
import FormSelectCustom from '@/components/formInput/FormSelectCustom'
import { Button } from '@/components/ui/button';
import { DatePickerRange } from '@/components/datePickerRange/DatePickerRange';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { IInstitution } from '@/services/institution/institution.interface';
import { IProviders } from '@/services/provider/provider.interface';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useDonationStore } from './donationStore';
import { IDonationsFilters } from './donations.data';

interface IDonationFiltersProps {
    lotes: string[]
    providers: IProviders[]
    institutions: IInstitution[];
}


export const DonationFilterDropDown = ({ providers, institutions, lotes }: IDonationFiltersProps) => {
    return (
        <div>
            <DonationFilters
                lotes={lotes}
                providers={providers}
                institutions={institutions} />
        </div>
    )
}

export const DonationFilters = ({ providers, institutions, lotes }: IDonationFiltersProps) => {
    const { filters, setFilter, cleanFilters } = useDonationStore();
    const typeDonation = filters.type === 'all' ? 'Entrada' : filters.type;

    const dateRangeValue: DateRange | undefined =
        filters.startDate && filters.endDate
            ? { from: new Date(filters.startDate), to: new Date(filters.endDate) }
            : undefined;

    const handleDateChange = (range?: DateRange) => {
        setFilter('startDate', range?.from ? format(range.from, 'yyyy-MM-dd') : null);
        setFilter('endDate', range?.to ? format(range.to, 'yyyy-MM-dd') : null);
    };

    return (
        <div className="flex items-end gap-3">
            <FormSelectCustom
                label='Tipo'
                id='1'
                className='w-28'
                value={filters.type}
                options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'Entrada', label: 'Entrada' },
                    { value: 'Salida', label: 'Salida' },
                ]}
                onChange={(e) => setFilter('type', e.target.value as IDonationsFilters['type'])}
            />
            <FormSelectCustom
                label='Lote'
                id='2'
                className='w-28'
                value={filters.lote === '' ? 'all' : filters.lote}
                options={[
                    { value: 'all', label: 'Todos' },
                    ...lotes.map(lo => ({ label: lo, value: lo }))
                ]}
                onChange={(e) => setFilter('lote', e.target.value === 'all' ? '' : e.target.value)}
            />
            <div className='w-48'>
                {typeDonation == 'Entrada' ?
                    <FormAutocompleteV2
                        label="Proveedor"
                        appendTo='body'
                        placeholder="Selecciona un proveedor"
                        valueDefault={filters.providerId?.toString() ?? ''}
                        data={providers.map(provider => ({
                            value: provider.id.toString(),
                            label: provider.name,
                        }))}
                        onChange={(value) => setFilter('providerId', value ? Number(value) : null)}
                    />
                    :
                    <FormAutocompleteV2
                        label="Institución"
                        placeholder="Selecciona una institución"
                        valueDefault={filters.institutionId?.toString() ?? ''}
                        data={institutions.map(institution => ({
                            value: institution.id.toString(),
                            label: institution.name,
                        }))}
                        onChange={(value) => setFilter('institutionId', value ? Number(value) : null)}
                    />
                }
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent">
                    Fecha
                </span>
                <DatePickerRange value={dateRangeValue} onChange={handleDateChange} />
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={cleanFilters}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="opacity-70" side="top">
                    <span>Limpiar filtros</span>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}