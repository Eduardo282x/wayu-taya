import React from "react";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// import { formatDateForInput } from "@/utils/formatters";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  /** Renderiza un `textarea` en vez de `input`. Para direcciones o notas largas. */
  multiline?: boolean;
  rows?: number;
  /** Mes/año mínimo navegable del calendario cuando `type="date"`. */
  minDate?: Date;
  /** Mes/año máximo navegable del calendario cuando `type="date"`. */
  maxDate?: Date;
}

const toDisplayDate = (value: unknown): string => {
  if (!value) return "";

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    return `${String(value.getDate()).padStart(2, "0")}/${String(value.getMonth() + 1).padStart(2, "0")}/${value.getFullYear()}`;
  }

  if (typeof value === "string") {
    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;

    const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (br) return value;

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return `${String(parsed.getDate()).padStart(2, "0")}/${String(parsed.getMonth() + 1).padStart(2, "0")}/${parsed.getFullYear()}`;
    }
  }

  return "";
};

const maskDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(
    (part) => part.length > 0
  );
  return parts.join("/");
};

const parseDisplayDate = (text: string): string | null => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const parseAnyToDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (br) {
      const date = new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]));
      return Number.isNaN(date.getTime()) ? undefined : date;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return undefined;
};

const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

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
  minDate,
  maxDate,
  ...inputProps
}) => {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isDateInput = type === "date";
  const isPasswordInput = type === "password";

  const isControlled = value !== undefined;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dateText, setDateText] = React.useState<string>(() =>
    toDisplayDate(isControlled ? value : (inputProps as { defaultValue?: unknown }).defaultValue)
  );

  React.useEffect(() => {
    if (isControlled) setDateText(toDisplayDate(value));
  }, [value, isControlled]);

  const selectedDate = React.useMemo(
    () => parseAnyToDate(isControlled ? value : dateText),
    [isControlled, value, dateText]
  );

  const calendarStartMonth = minDate ?? new Date(1900, 0, 1);
  const calendarEndMonth = maxDate ?? new Date(new Date().getFullYear() + 100, 11, 31);

  const assignInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    const externalRef = (inputProps as { ref?: React.Ref<HTMLInputElement> }).ref;
    if (typeof externalRef === "function") {
      externalRef(node);
    } else if (externalRef && typeof externalRef === "object") {
      (externalRef as { current: HTMLInputElement | null }).current = node;
    }
  };

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

  const emitDateChange = (isoValue: string) => {
    const syntheticEvent = {
      target: {
        value: isoValue,
        name: (inputProps as { name?: string }).name,
        id,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
    (inputProps as { onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }).onChange?.(syntheticEvent);
  };

  const handleDateSelect = (date?: Date) => {
    if (date) {
      const display = toDisplayDate(date);
      setDateText(display);
      if (inputRef.current) inputRef.current.value = display;
      emitDateChange(toISODate(date));
    }
    setOpen(false);
  };

  const handleDateTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDateInput(event.target.value);
    if (!isControlled) {
      event.currentTarget.value = masked;
    }
    setDateText(masked);

    const iso = parseDisplayDate(masked);
    if (iso) emitDateChange(iso);
  };

  const handleDateFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!isControlled) {
      const display = toDisplayDate(event.currentTarget.value);
      if (display) event.currentTarget.value = display;
    }
    (inputProps as { onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void }).onFocus?.(event);
  };

  const handleDateBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    (inputProps as { onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void }).onBlur?.(event);
  };

  const handleDateKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const iso = parseDisplayDate(maskDateInput(event.currentTarget.value));
      if (iso) emitDateChange(iso);
      setOpen(false);
      return;
    }
    (inputProps as { onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void }).onKeyDown?.(event);
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
        <div className="relative w-full">
          <input
            {...inputProps}
            ref={assignInputRef}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={placeholder === "Selecciona una fecha" ? "dd/mm/aaaa" : placeholder}
            className={cn(
              "w-full rounded-md focus:outline-1 focus:outline-blue-800 px-3 py-1 pr-9 bg-white border",
              className
            )}
            value={isControlled ? dateText : undefined}
            defaultValue={
              !isControlled
                ? toDisplayDate((inputProps as { defaultValue?: unknown }).defaultValue)
                : undefined
            }
            onChange={handleDateTextChange}
            onFocus={handleDateFocus}
            onBlur={handleDateBlur}
            onKeyDown={handleDateKeyDown}
            disabled={inputProps.disabled}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Abrir calendario"
                disabled={inputProps.disabled}
                className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 overflow-hidden rounded-md" align="start">
              <Calendar
                mode="single"
                locale={es}
                selected={selectedDate}
                defaultMonth={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-lg border w-full"
                captionLayout="dropdown"
                startMonth={calendarStartMonth}
                endMonth={calendarEndMonth}
              />
            </PopoverContent>
          </Popover>
        </div>
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
