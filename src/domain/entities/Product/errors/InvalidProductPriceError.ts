export class InvalidProductPriceError extends Error {
  constructor(price: number) {
    super(`"${price}" is an invalid category price`);
    this.name = "InvalidProductPriceError";
  };
};