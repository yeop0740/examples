import {Store} from "../store";

export interface StoreRepository {
    findById(storeId: number): Store;
}
