import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// import { formatDateForInput } from "@/utils/formatters";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  /** Renderiza un `textarea` en vez de un `input`. Para direcciones o notas largas. */
  multiline?: boolean;
  rows?: number;
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
  required = true,
  multiline = false,
  rows = 3,
  ...inputProps
}) => {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isDateInput = type === "date";
  const isPasswordInput = type === "password";

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

  // El cast es seguro: RHF y los handlers de este componente solo leen
  // `event.target` (name, value, type), igual en un input que en un textarea.
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const compatible = event as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange?.(compatible);
    (inputProps as { onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }).onChange?.(compatible);
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
        className="block text-sm whitespace-nowrap font-medium mb-1 bg-linear-to-r from-blue-800 to-[#3089FD] bg-clip-text text-transparent"
      >
        {label}
        {required ? (
          <span className="text-red-500 ml-1">*</span>
        ) : (
          <span className="text-gray-500 font-normal"> (Opcional)</span>
        )}
      </label>

      {isDateInput ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start rounded-md border bg-white px-3 py-1 text-left",
                !selectedDate && "text-muted-foreground",
                className
              )}
              disabled={inputProps.disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: es }) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 overflow-hidden rounded-md" align="start">
            <Calendar
              mode="single"
              locale={es}
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-lg border w-full"
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      ) : isPasswordInput ? (
        <div className="relative w-full">
          <input
            id={id}
            className={cn(
              "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white border",
              className,
              "pr-9"
            )}
            {...inputProps}
            type={showPassword ? "text" : "password"}
            value={typeof value === "string" || typeof value === "number" ? value : (inputProps as { value?: string }).value}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-800 cursor-pointer"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>
      ) : multiline ? (
        <textarea
          id={id}
          className={cn(
            "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white border resize-y",
            className
          )}
          {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={rows}
          value={typeof value === "string" || typeof value === "number" ? value : (inputProps as { value?: string }).value}
          onChange={handleTextareaChange}
        />
      ) : (
        <input
          id={id}
          className={cn(
            "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 bg-white border",
            className
          )}
          {...inputProps}
          type={type}
          value={typeof value === "string" || typeof value === "number" ? value : (inputProps as { value?: string }).value}
          onChange={handleInputChange}
        />
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormInputCustom;
