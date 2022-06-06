import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { ListAllUsersUseCase } from "../../../src/useCases/users/ListAllUsersUseCase";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let listAllUsersUseCase: ListAllUsersUseCase;

describe("List All Users UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    listAllUsersUseCase = new ListAllUsersUseCase(
      usersRepositoryInMemory,
    );
  });

  it("should return all users data if user authenticated is an admin", async () => {
    const bcryptEncoder = new BcryptEncoder();
    const hashedPassword = await bcryptEncoder.encode("password");

    const dateNow = new Date();

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersRepositoryInMemory.create({
      id: "fake-id2",
      name: "User",
      email: "user@example.com",
      password: hashedPassword,
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const userOrError = await listAllUsersUseCase.execute();

    const expectedResponse = [
      {
        id: "fake-id",
        name: "Admin",
        email: "admin@example.com",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id2",
        name: "User",
        email: "user@example.com",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    expect(userOrError.isRight()).toEqual(true);
    expect(userOrError.value).toEqual(expectedResponse);
  });
});