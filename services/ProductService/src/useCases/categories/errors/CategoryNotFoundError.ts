export class CategoryNotFoundError extends Error {
  constructor(id: string) {
    super(`Category with id: "${id}" not found.`);
    this.name = "CategoryNotFoundError"
  };
};