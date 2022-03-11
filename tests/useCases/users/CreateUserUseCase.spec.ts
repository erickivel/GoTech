import { CreateUserUseCase } from "../../../src/useCases/users/CreateUserUseCase";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

describe("Create User", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepositoryInMemory: UsersRepositoryInMemory;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = {
      id: "dawwd",
      name: "John",
      email: "john@example.com",
      password: "password",
    };

    await createUserUseCase.execute(user);

    const createUser = await usersRepositoryInMemory.findByEmail(user.email);

    expect(createUser).toHaveProperty("name");
  });
});
