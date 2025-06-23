import { FormAutocompleteV2 } from '@/components/formInput/FormAutoCompleteCustomV2';
import FormSelectCustom from '@/components/formInput/FormSelectCustom'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IInstitution } from '@/services/institution/institution.interface';
import { IProviders } from '@/services/provider/provider.interface';
import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

interface IDonationFiltersProps {
    providers: IProviders[]
    institutions: IInstitution[];
    handleDonationFilterChange: (filter: string, value: string | number) => void;
    cleanFilters: () => void
}


export const DonationFilterDropDown = ({ providers, institutions, handleDonationFilterChange, cleanFilters }: IDonationFiltersProps) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="outline"
                        className="bg-white text-[#0350af] border border-[#0350af] hover:bg-[#e6fafd] hover:text-[#0350af]"
                    >
                        <FaFilter />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DonationFilters
                        providers={providers}
                        institutions={institutions}
                        handleDonationFilterChange={handleDonationFilterChange}
                        cleanFilters={cleanFilters} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export const DonationFilters = ({ providers, institutions, handleDonationFilterChange, cleanFilters }: IDonationFiltersProps) => {
    const [typeDonation, setTypeDonation] = useState<'Entrada' | 'Salida'>('Entrada');
    return (
        <div className='flex items-end gap-4 p-4'>
            <FormSelectCustom
                label='Tipo'
                id='1'
                options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'Entrada', label: 'Entrada' },
                    { value: 'Salida', label: 'Salida' },
                ]}
                onChange={(e) => {
                    setTypeDonation(e.target.value as 'Entrada' | 'Salida');
                    handleDonationFilterChange('type', e.target.value);
                }}
            />
            <FormSelectCustom
                label='Lote'
                id='2'
                options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'Lote 1', label: 'Lote 1' },
                    { value: 'Lote 2', label: 'Lote 2' },
                ]}
                onChange={(e) => handleDonationFilterChange('lote', e.target.value)}
            />
            <div className='w-60'>
                {typeDonation == 'Entrada' ?
                    <FormAutocompleteV2
                        label="Proveedor"
                        placeholder="Selecciona un proveedor"
                        data={providers.map(provider => ({
                            value: provider.id.toString(),
                            label: provider.name,
                        }))}
                        onChange={(value) => {
                            handleDonationFilterChange('providerId', value);
                        }}
                    />
                    :
                    <FormAutocompleteV2
                        label="Institución"
                        placeholder="Selecciona una institución"
                        data={institutions.map(institution => ({
                            value: institution.id.toString(),
                            label: institution.name,
                        }))}
                        onChange={(value) => {
                            handleDonationFilterChange('institutionId', value);
                        }}
                    />
                }
            </div>
            <Button
                variant="animated"
                className="bg-transparent border-white text-white hover:bg-blue-600"
                onClick={cleanFilters}
            >
                Limpiar filtros
            </Button>
        </div>
    )
}
