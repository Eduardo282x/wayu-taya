/**
 * Ubicacion geografica, tal y como la espera la API.
 *
 * Sustituye a la antigua FK `parishId` / `id_parroquia`: el backend ya no
 * expone `/parroquias` ni `/state`, asi que la jerarquia viaja como texto y el
 * catalogo de referencia se queda en el frontend
 * (`components/dialog-location/location.data.ts`).
 *
 * Los tres niveles son obligatorios, porque hay nombres de parroquia repetidos
 * entre municipios distintos.
 *
 * Vive aqui y no en `institution.interface.ts` porque lo comparten
 * instituciones, personas y eventos, igual que el unico `LocationDTO` del
 * backend. La produce `DialogLocation`.
 */
export interface Location {
    state: string;
    town: string;
    parish: string;
}
