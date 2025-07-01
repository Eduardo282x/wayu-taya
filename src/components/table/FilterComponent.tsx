/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@/components/table/table.interface';
import { debounce } from '@/lib/debounce';
// import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterProps {
    data: any[];
    setDataFilter: (value: any) => void;
    columns: Column[];
    placeholder: string;
}

export const FilterComponent = ({ data, setDataFilter, columns, placeholder }: FilterProps) => {
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

    // const clearFilter = () => {
    //     setDataFilter(data);
    //     setFilter('')
    // }

    return (
        <div className="flex items-center justify-between px-2 h-full">
            <input
                type="search"
                placeholder={placeholder}
                className="w-[100%] lg:w-60 focus:outline-0 shadow-2xl border-1 border-gray-400 bg-gray-200 rounded-lg h-9 placeholder:opacity-60 p-2 manrope focus:ring-1 focus:ring-[#3449D5] transition-all 100s text-[0.7rem] lg:text-[1rem]"
                value={filter}
                onChange={onChange}
            />
            {/* {filter !== '' && (
                <span onClick={clearFilter} className='cursor-pointer'>
                    <X size={12} className='text-gray-400' />
                </span>
            )} */}
        </div>
    )
}
