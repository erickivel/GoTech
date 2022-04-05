type User = {
  id: string;
  name: string;
  email: string;
}

type Product = {
  id: string;
  name: string;
  price: number;
  amount: number;
};

export interface IOrderData {
  id: string;
  user: User;
  products: Product[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}