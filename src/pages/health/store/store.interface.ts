// services/almacen/almacen.interface.ts
export interface IAlmacen {
  id: number;
  nombre: string;
  direccion: string;
  // Otros campos si los tienes
}

export interface AlmacenBody {
  nombre: string;
  direccion: string;
}

export interface GroupAlmacenes {
  allAlmacenes: IAlmacen[];
  almacenes: IAlmacen[];
}