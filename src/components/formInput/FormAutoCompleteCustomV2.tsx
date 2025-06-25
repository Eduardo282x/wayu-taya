import { Check, ChevronsUpDown, SearchIcon } from "lucide-react"
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface AutoCompleteProps {
  data: { label: string, value: string }[];
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
  valueDefault?: string | number;
  resetValues?: boolean
}

export const FormAutocompleteV2: FC<AutoCompleteProps> = ({ label, data, placeholder, onChange, valueDefault, resetValues }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | number>(valueDefault ? valueDefault : "");
  const [inputValue, setInputValue] = useState<string>("");
  const [dataFiltered, setDataFiltered] = useState<{ label: string, value: string }[]>(data);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(valueDefault ? valueDefault.toString() : "");
  }, [valueDefault])

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onChange(currentValue);

    if (resetValues) {
      setValue('')
    }
    setOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    setInputValue('')
    setDataFiltered(data);
  }, [open])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const filteredData = data.filter((option) =>
      normalize(option.label).includes(normalize(e.target.value))
    );
    setDataFiltered(filteredData);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const selectedOption = dataFiltered[0];
      if (selectedOption) {
        handleSelect(selectedOption.value.toString());
      }
    }
  }

  return (
    <div className="relative w-full" ref={ref}>
      <div>
        <label
          className="pl-1 block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
        >
          {label}
        </label>
        <Button
          variant="outline"
          type="button"
          className="w-full justify-between overflow-hidden"
          onClick={() => setOpen(!open)}
        >
          <span className="-ml-2">
            {value
              ? data.find((option) => option.value.toString() === value)?.label
              : placeholder}
          </span>
          <div className="absolute top-[2.15rem] right-1 bg-white">
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </div>

      {open && (
        <div className="border rounded-lg overflow-hidden absolute animationOpacity z-50 mt-1 bg-white">
          <div className="flex items-center justify-start px-2 border-b-2">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <input
              autoFocus
              placeholder={placeholder}
              className="px-2 py-1 rounded-none outline-none w-full"
              value={inputValue}
              onChange={onChangeInput}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="max-h-60 overflow-y-auto px-2 w-full">
            {dataFiltered && dataFiltered.map((option: { label: string, value: string }, index: number) => (
              <p
                key={index}
                onClick={() => handleSelect(option.value.toString())}
                className="text-sm flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded-md transition-all cursor-pointer">
                {option.label}
                {option.value.toString() === value && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </p>
            ))}

            {dataFiltered.length == 0 && (
              <p className="text-[.85rem] py-2 text-center text-gray-600">No se encontraron datos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}