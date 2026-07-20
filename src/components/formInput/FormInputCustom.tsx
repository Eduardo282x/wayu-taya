import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// import { formatDateForInput } from "@/utils/formatters";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const FormInputCustom: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  type,
  className,
  ...inputProps
}) => {
  const [open, setOpen] = React.useState(false);

  const isDateInput = type === "date";

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    }

    const parsedDate = new Date(value as string | Date | number);
    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    (inputProps as { onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }).onChange?.(event);
  };

  const handleDateSelect = (date?: Date) => {
    const formattedValue = date ? new Date(date) : "";

    const syntheticEvent = {
      target: {
        value: formattedValue,
        name: inputProps.name,
        id,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
    (inputProps as { onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }).onChange?.(syntheticEvent);

    setOpen(false);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1 bg-gradient-to-r from-blue-800 to-[#34A8D5] bg-clip-text text-transparent"
      >
        {label}
      </label>

      {isDateInput ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start rounded-md border bg-white px-3 py-1 text-left shadow-sm",
                !selectedDate && "text-muted-foreground",
                className
              )}
              disabled={inputProps.disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: es }) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 overflow-hidden rounded-md" align="start">
            <Calendar
              mode="single"
              locale={es}
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      ) : (
        <input
          id={id}
          className={cn(
            "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white shadow-xl border",
            className
          )}
          {...inputProps}
          type={type}
          value={typeof value === "string" || typeof value === "number" ? value : (inputProps as { value?: string }).value ?? ""}
          onChange={handleInputChange}
        />
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormInputCustom;
