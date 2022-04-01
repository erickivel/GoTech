import { container } from "tsyringe";

import { ListAllUsersController } from "../../../src/controllers/users/ListAllUsersController";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../../doubles/UsersActions";

describe("List All Users Controller", () => {
  let listAllUsersController: ListAllUsersController;

  beforeEach(() => {

    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    listAllUsersController = new ListAllUsersController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200 and user data if user is authenticated", async () => {
    const usersActions = container.resolve(UsersActions);

    const bcryptEncoder = new BcryptEncoder();
    const hashedPassword = await bcryptEncoder.encode("password");

    const userCreated = await usersActions.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: true,
    });

    const fakeRequest = {
      user: {
        id: userCreated.id,
      }
    }

    const result = await listAllUsersController.handle(fakeRequest);

    const expectedResponse = [
      {
        id: userCreated.id,
        name: "Admin",
        email: "admin@example.com",
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt
      }
    ];

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(expectedResponse);
  });

  it("should return status code 403 when the id is missing", async () => {
    const usersActions = container.resolve(UsersActions);

    const bcryptEncoder = new BcryptEncoder();
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersActions.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: true,
    });

    const fakeRequest = {
    }

    const result = await listAllUsersController.handle(fakeRequest);

    expect(result.statusCode).toBe(401);
    expect(result.body).toEqual(`User is not authenticated!`);
  });
});