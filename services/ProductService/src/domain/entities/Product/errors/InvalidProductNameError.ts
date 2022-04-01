export class InvalidProductNameError extends Error {
  constructor(name: string) {
    super(`"${name}" is an invalid product name`);
    this.name = "InvalidProductNameError";
  }
}