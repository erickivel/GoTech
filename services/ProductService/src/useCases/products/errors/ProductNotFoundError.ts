export class ProductNotFoundError extends Error {
  constructor(id?: string) {
    if (id) {
      super(`Product with id "${id}" not found`);
    } else {
      super(`Product not found`);
    }
    this.name = "ProductNotFoundError";
  }
}