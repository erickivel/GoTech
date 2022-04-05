export class InvalidProductStockError extends Error {
  constructor(stock: number) {
    super(`"${stock}" is an invalid product stock`);
    this.name = "InvalidProductStockError";
  };
};