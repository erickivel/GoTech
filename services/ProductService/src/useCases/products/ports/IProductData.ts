import { Category } from "../../../domain/entities/Category";

export interface IProductData {
  id: string;
  name: string;
  stock: number;
  price: number;
  categoryId: string | null;
  category?: Category | null;
  createdAt: Date;
  updatedAt: Date;
};