import { Button } from '../ui/button';
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

interface DatePickerRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value?: DateRange | undefined;
    onChange?: (range: DateRange | undefined) => void;
}

export const DatePickerRange = ({ className, value, onChange }: DatePickerRangeProps) => {

    const [date, setDate] = useState<DateRange | undefined>(value)
    const isControlled = !!onChange
    const selected = isControlled ? value : date

    const handleSelect = (range: DateRange | undefined) => {
        if (!isControlled) setDate(range)
        onChange?.(range)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !selected && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {selected?.from ? (
                            selected.to ? (
                                <>
                                    {format(selected.from, "PPP", { locale: es })} - {" "}
                                    {format(selected.to, "PPP", { locale: es })}
                                </>
                            ) : (
                                format(selected.from, "PPP", { locale: es })
                            )
                        ) : (
                            <span>Seleccionar rango de fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 p-0 overflow-hidden rounded-md" align="start">
                    <Calendar
                        autoFocus
                        mode="range"
                        defaultMonth={selected?.from}
                        selected={selected}
                        locale={es}
                        className="rounded-lg border w-full"
                        onSelect={handleSelect}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
