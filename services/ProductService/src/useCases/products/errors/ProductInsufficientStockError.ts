export class ProductInsufficientStockError extends Error {
  constructor(id: string) {
    super(`Product with id "${id}" has insufficient stock`);
    this.name = "ProductInsufficientStockError";
  }
}