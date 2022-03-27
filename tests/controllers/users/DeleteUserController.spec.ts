import { container } from "tsyringe";

import { DeleteUserController } from "../../../src/controllers/users/DeleteUserController";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../../doubles/UsersActions";

describe("Delete User Controller", () => {
  let deleteUserController: DeleteUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    deleteUserController = new DeleteUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200 if user is successfully deleted", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersActions.create({
      id: "fake-id2",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const fakeRequest = {
      user: {
        id: "fake-id",
      },
      params: {
        user_id: "fake-id2"
      }
    }

    const result = await deleteUserController.handle(fakeRequest);

    const users = await usersActions.listAll();

    const expectedResponse = [
      {
        id: "fake-id",
        name: "Admin",
        email: "admin@example.com",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    expect(users).toEqual(expectedResponse);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual("User deleted!");
  });

  it("should return status code 400 with the user_id_to_be_deleted is missing", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    const fakeRequest = {
      user: {
        id: "fake-id",
      },
      params: {
      }
    }

    const result = await deleteUserController.handle(fakeRequest);

    const users = await usersActions.listAll();

    const expectedResponse = [
      {
        id: "fake-id",
        name: "Admin",
        email: "admin@example.com",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    expect(users).toEqual(expectedResponse);
    expect(result.body).toEqual("Missing parameter(s): user_id.");
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 401 if the admin's id is missing", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersActions.create({
      id: "fake-id2",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const fakeRequest = {
      user: {
      },
      params: {
        user_id: "fake-id2"
      }
    }

    const result = await deleteUserController.handle(fakeRequest);

    const users = await usersActions.listAll();

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

    expect(users).toEqual(expectedResponse);
    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 403 if trying to delete a nonexistent user", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "fake-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersActions.create({
      id: "fake-id2",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const fakeRequest = {
      user: {
        id: "fake-id"
      },
      params: {
        user_id: "non-existent-id",
      }
    }

    const result = await deleteUserController.handle(fakeRequest);

    const users = await usersActions.listAll();

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

    expect(users).toEqual(expectedResponse);
    expect(result.body).toEqual(`User with id "non-existent-id" not found`);
    expect(result.statusCode).toBe(403);
  });
})