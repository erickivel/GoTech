export class InvalidProductPriceError extends Error {
  constructor(price: number) {
    super(`"${price}" is an invalid product price`);
    this.name = "InvalidProductPriceError";
  };
};