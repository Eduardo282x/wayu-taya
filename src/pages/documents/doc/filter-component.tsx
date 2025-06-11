import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { CiSearch } from "react-icons/ci"
import type { DocumentData, FilterColumn } from "../doc/types/document"


const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

interface FilterComponentProps {
  data: DocumentData[]
  setDataFilter: (data: DocumentData[]) => void
  columns: FilterColumn[]
}

export const FilterComponent = ({ data, setDataFilter, columns }: FilterComponentProps) => {
  const [filter, setFilter] = useState<string>("")

  useEffect(() => {
    setDataFilter(data)
  }, [data, setDataFilter])

  const normalize = (str: string): string =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()

  const getNestedValue = (obj: any, path: string): string => {
    return (
      path
        .split(".")
        .reduce((acc, key) => acc?.[key], obj)
        ?.toString()
        .toLowerCase() || ""
    )
  }

  const handleFilter = (value: string) => {
    if (!value) {
      setDataFilter(data)
      return
    }

    const keys = columns.map((col) => col.column)

    const filtered = data.filter((item) =>
      keys.some((key) => normalize(getNestedValue(item, key)).includes(normalize(value))),
    )

    setDataFilter(filtered)
  }

  const debouncedFilter = debounce(handleFilter, 200)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFilter(value)
    debouncedFilter(value)
  }

  const clearFilter = () => {
    setDataFilter(data)
    setFilter("")
  }

  return (
    <div className="flex items-center justify-between w-60 border rounded-lg px-3 h-9 bg-white">
      <CiSearch className="text-gray-400" size={20} />
      <input
        className="outline-none text-gray-600 text-sm flex-1 mx-2"
        placeholder="Buscar..."
        onChange={onChange}
        value={filter}
      />
      <span onClick={clearFilter} className="cursor-pointer">
        <X size={12} className="text-gray-400" />
      </span>
    </div>
  )
}
