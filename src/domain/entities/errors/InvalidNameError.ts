export class InvalidNameError extends Error {
  constructor(name: string) {
    super(`"${name}" is an invalid name`);
    this.name = "InvalidNameError";
  }
}
