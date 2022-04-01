export class InvalidPasswordError extends Error {
  constructor() {
    super("Invalid Password");
    this.name = "InvalidPasswordError";
  }
}
