export class UserIsNotAdminError extends Error {
  constructor() {
    super("User is not an admin");
    this.name = "UserIsNotAdmin";
  };
};