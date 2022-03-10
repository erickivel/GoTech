export class InvalidNameError extends Error implements IDomainError {
  constructor(name: string) {
    super(`"${name}" is an invalid name`);
    this.name = "InvalidNameError";
  }
}
