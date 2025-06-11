/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@/interfaces/table.interface';
import { debounce } from '@/lib/debounce';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';

interface FilterProps {
    data: any[];
    setDataFilter: (value: any) => void;
    columns: Column[];
}

export const FilterComponent = ({ data, setDataFilter, columns }: FilterProps) => {
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        setDataFilter(data)
    }, [data])

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const getNestedValue = (obj: any, path: string): string => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj)?.toString().toLowerCase() || ''
    }

    const handleFilter = (value: string) => {
        if (!value) {
            setDataFilter(data)
            return
        }

        const keys = columns
            .filter((col: Column) => col.isIcon === false)
            .map((col: Column) => col.column)

        const filtered = data.filter((item) =>
            keys.some((key) =>
                normalize(getNestedValue(item, key)).includes(normalize(value))
            )
        )

        setDataFilter(filtered);
    }

    const debouncedFilter = debounce(handleFilter, 200)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value)
        debouncedFilter(value)
    }

    const clearFilter = () => {
        setDataFilter(data);
        setFilter('')
    }

    return (
        <div className="flex items-center justify-between w-60 border rounded-lg px-3 h-9">
            <CiSearch
                className=" text-gray-400" // Posiciona el icono
                size={20}
            />
            <input
                className="outline-none text-gray-600 text-sm"
                placeholder="Buscar..."
                onChange={onChange}
                value={filter}
            />
            <span onClick={clearFilter} className='cursor-pointer'>
                <X size={12} className='text-gray-400' />
            </span>
        </div>
    )
}
