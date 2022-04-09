export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product with id "${id}" not found`);
    this.name = "ProductNotFoundError";
  }
}