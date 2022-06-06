export class EmailIsAlreadyTakenError extends Error {
  constructor(email: string) {
    super(`Email: "${email}" is already taken!`);
    this.name = "EmailIsAlreadyTakenError";
  };
};