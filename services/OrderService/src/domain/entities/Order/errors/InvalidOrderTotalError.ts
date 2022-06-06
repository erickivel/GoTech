export class InvalidOrderTotalError extends Error {
  constructor(total: number) {
    super(`"${total}" is an invalid order total.`);
    this.name = "InvalidOrderTotalError";
  };
};