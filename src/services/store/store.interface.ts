export interface StoreBody {
    name: string;
    address: string;
    
}

export interface GroupStore {
    allStores: IStore[];
  
    stores: IStore[]; 
}

export interface IStore {
    id: number;
    name: string;
    address: string;

}