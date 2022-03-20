export class IncorrectPasswordError extends Error {
  constructor() {
    super("Password incorrect");
    this.name = "IncorrectPasswordError"
  };
};