import { IOrderData } from "./IOrderData";

export interface IOrdersRepository {
  create(data: IOrderData): Promise<IOrderData>;
  listAll(): Promise<IOrderData[]>;
};