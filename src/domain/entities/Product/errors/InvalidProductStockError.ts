export class InvalidProductStockError extends Error {
  constructor(stock: number) {
    super(`"${stock}" is an invalid category stock`);
    this.name = "InvalidProductStockError";
  };
};