export class ProductAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Product "${name}" already exists`);
    this.name = "ProductAlreadyExistsError";
  };
};