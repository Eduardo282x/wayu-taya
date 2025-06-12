
export interface IAlmacen {
  id: number;
  nombre: string;
  direccion: string;
 
}

export interface AlmacenBody {
  nombre: string;
  direccion: string;
}

export interface GroupAlmacenes {
  allAlmacenes: IAlmacen[];
  almacenes: IAlmacen[];
}