import { DeleteUserUseCase } from "../../../src/useCases/users/DeleteUserUseCase";
import { UserNotFoundError } from "../../../src/useCases/users/errors/UserNotFoundError";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let deleteUserUseCase: DeleteUserUseCase;

describe("Delete User UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    deleteUserUseCase = new DeleteUserUseCase(
      usersRepositoryInMemory,
    );
  });

  it("should delete the user with id provided", async () => {
    const dateNow = new Date();

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersRepositoryInMemory.create({
      id: "fake-id2",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const result = await deleteUserUseCase.execute({ userIdToBeDeleted: "fake-id2" });

    const users = await usersRepositoryInMemory.listAll();

    const expectedResponse = [
      {
        id: "fake-id",
        name: "Admin",
        email: "admin@example.com",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual(null)
    expect(users).toEqual(expectedResponse);
  });

  it("should delete the user with id provided", async () => {
    const dateNow = new Date();

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const result = await deleteUserUseCase.execute({ userIdToBeDeleted: "inexistent-id" });

    const users = await usersRepositoryInMemory.listAll();

    const expectedResponse = [
      {
        id: "fake-id",
        name: "User",
        email: "user@example.com",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toEqual(new UserNotFoundError("inexistent-id"))
    expect(users).toEqual(expectedResponse);
  });
});