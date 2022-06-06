export class UnmatchedPasswordError extends Error {
  constructor() {
    super("Passwords not match");
    this.name = "UnmatchedPasswordError"
  };
};