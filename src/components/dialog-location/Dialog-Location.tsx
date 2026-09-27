import { useEffect, useMemo, useState } from "react";

import { FormAutocompleteV2 } from "@/components/formInput/FormAutoCompleteCustomV2";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Location } from "@/services/institution/institution.interface";
import { formatLocation, locations } from "./location.data";

interface DialogLocationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: Location) => void;
  /** Ubicacion a mostrar al abrir. En edicion es la que ya tiene el registro. */
  value?: Location;
}

const toOption = (label: string) => ({ label, value: label });

/**
 * Selector de parroquia para Venezuela, en cascada: Estado -> Municipios ->
 * Parroquias.
 *
 * Los tres niveles usan el nombre como valor porque el catalogo no trae ids
 * para municipio ni parroquia, y porque la API ya no los pide: espera el
 * objeto `location` con los tres nombres. Cada nivel se bloquea hasta que el
 * anterior este elegido, y cambiar un nivel limpia los de abajo para que no
 * queden combinaciones imposibles (una parroquia de Maracaibo con estado
 * Sucre).
 */
export const DialogLocation = ({ open, onOpenChange, onConfirm, value }: DialogLocationProps) => {
  const [state, setState] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [parish, setParish] = useState<string>("");

  // Al abrir se siembra con `value` para que en edicion aparezca la ubicacion
  // ya guardada. Sin `value` arranca vacio.
  useEffect(() => {
    if (open) {
      setState(value?.state ?? "");
      setTown(value?.town ?? "");
      setParish(value?.parish ?? "");
    }
  }, [open, value]);

  const estadoActual = useMemo(
    () => locations.find((location) => location.estado === state),
    [state]
  );

  const municipios = useMemo(
    () => estadoActual?.municipios ?? [],
    [estadoActual]
  );

  const parroquiaActual = useMemo(
    () => municipios.find((item) => item.municipio === town),
    [municipios, town]
  );

  const parroquias = useMemo(
    () => parroquiaActual?.parroquias ?? [],
    [parroquiaActual]
  );

  const limpiar = () => {
    setState("");
    setTown("");
    setParish("");
  };

  const handleState = (value: string) => {
    setState(value);
    // Cambia el estado, asi que municipio y parroquia dejan de ser validos.
    setTown("");
    setParish("");
  };

  const handleTown = (value: string) => {
    setTown(value);
    setParish("");
  };

  const confirmar = () => {
    onConfirm({ state, town, parish });
    onOpenChange(false);
  };

  const completo = !!state && !!town && !!parish;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar parroquia</DialogTitle>
          <DialogDescription>
            Elige el estado, el municipio y la parroquia. Se enviarán como la ubicación de la
            institución.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* `overlay` y no `appendTo`: este dialogo es modal, y Radix deja el
              `document.body` con `pointer-events: none` (se lo reactiva solo al
              DialogContent), asi que un desplegable portalizado a `body` se veria
              pero no se podria pulsar. Ademas el clic cerraria el modal, porque
              cae fuera de la capa. Con `overlay` se dibuja encima sin nada de eso. */}
          <FormAutocompleteV2
            label="Estado"
            overlay
            data={locations.map((location) => toOption(location.estado))}
            placeholder="Selecciona un estado"
            valueDefault={state}
            onChange={handleState}
          />

          <FormAutocompleteV2
            label="Municipio"
            overlay
            data={municipios.map((item) => toOption(item.municipio))}
            placeholder={state ? "Selecciona un municipio" : "Primero elige un estado"}
            valueDefault={town}
            onChange={handleTown}
            disabled={!state}
          />

          <FormAutocompleteV2
            label="Parroquia"
            overlay
            data={parroquias.map(toOption)}
            placeholder={town ? "Selecciona una parroquia" : "Primero elige un municipio"}
            valueDefault={parish}
            onChange={setParish}
            disabled={!town}
          />
        </div>

        {completo && (
          <p className="text-sm text-gray-700 manrope bg-white/60 rounded-md border px-3 py-2">
            {formatLocation({ state, town, parish })}
          </p>
        )}

        <DialogFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={limpiar}>
            Limpiar
          </Button>
          <Button type="button" variant="animated" onClick={confirmar} disabled={!completo}>
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
