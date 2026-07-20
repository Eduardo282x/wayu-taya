import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  appendTo?: "body" | HTMLElement | null;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  name?: string;
  onChange?: (event: { target: { value: string; id?: string; name?: string } }) => void;
  onValueChange?: (value: string) => void;
}

const FormSelectCustom: React.FC<FormSelectProps> = ({
  label,
  id,
  error,
  options,
  placeholder = "Selecciona una opción",
  appendTo,
  className,
  triggerClassName,
  contentClassName,
  value,
  defaultValue,
  disabled,
  name,
  onChange,
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue?.toString() ?? value?.toString()
  );

  const selectedValue = value?.toString() ?? internalValue;

  const handleValueChange = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);

    onChange?.({
      target: {
        value: nextValue,
        id,
        name,
      },
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
      >
        {label}
      </label>

      <Select
        value={selectedValue}
        defaultValue={defaultValue?.toString()}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          name={name}
          className={cn(
            "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white shadow-xl border",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          container={appendTo === "body" ? document.body : appendTo ?? undefined}
          position="popper"
          sideOffset={4}
          className={cn("max-h-60 overflow-y-auto", contentClassName)}
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormSelectCustom;
