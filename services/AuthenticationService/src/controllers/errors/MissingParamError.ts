export class MissingParamError extends Error {
  constructor(missingParams: string) {
    super(`Missing parameter(s): ${missingParams}.`);
    this.name = "MissingParamError";
  };
};