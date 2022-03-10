import { InvalidNameError } from "./errors/InvalidName";
import { User } from "./User";

describe("User Validator", () => {
  test("Should not accept name with more than6 letters", () => {
    const user = {
      id: "awdawdawd",
      name: "MoreThan6letters",
      email: "johndoe@example.com",
      password: "password",
      createdAt: new Date(),
    };

    const createdUser = User.create(user);

    expect(createdUser.value).toEqual(new InvalidNameError(user.name));
  });
});
