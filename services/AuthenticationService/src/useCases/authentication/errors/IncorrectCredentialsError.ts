export class IncorrectCredentialsError extends Error {
  constructor() {
    super("Email or password incorrect");
    this.name = "IncorrectCredentialsError";
  };
};