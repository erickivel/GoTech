export class CategoryAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Category "${name}" already exists`);
    this.name = "CategoryAlreadyExistsError";
  };
};