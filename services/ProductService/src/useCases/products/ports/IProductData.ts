export interface IProductData {
  id: string;
  name: string;
  stock: number;
  price: number;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
};