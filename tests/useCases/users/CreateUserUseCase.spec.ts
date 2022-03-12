import { CreateUserUseCase } from "../../../src/useCases/users/CreateUserUseCase";
import { FakeEncoder } from "../../doubles/FakeEncoder";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

describe("CreateUser UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let fakeEncoder: FakeEncoder;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    fakeEncoder = new FakeEncoder();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory, fakeEncoder);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "John",
      email: "john@example.com",
      password: "password",
    };

    const userOrError = await createUserUseCase.execute(user);

    const createdUser = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userOrError.isRight()).toBe(true);
    expect(createdUser).toHaveProperty("id");
    expect(createdUser?.password).not.toBe(user.password);
  });
});
