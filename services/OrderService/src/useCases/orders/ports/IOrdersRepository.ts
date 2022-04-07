import { IOrderData } from "./IOrderData";

export interface IOrdersRepository {
  create(data: IOrderData): Promise<IOrderData>;
  filterByUserId(userId: string): Promise<IOrderData[]>;
};