export class InvalidCategoryNameError extends Error {
  constructor(name: string) {
    super(`"${name}" is an invalid category name`);
    this.name = "InvalidCategoryNameError"
  };
};