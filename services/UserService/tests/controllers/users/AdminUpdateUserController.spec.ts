import { container } from "tsyringe";

import { AdminUpdateUserController } from "../../../src/controllers/users/AdminUpdateUserController";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { IEncoder } from "../../../src/useCases/users/ports/IEncoder";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../../doubles/UsersActions";

describe("Admin Update User Controller", () => {
  let adminUpdateUserController: AdminUpdateUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<IEncoder>("Encoder", BcryptEncoder);
    adminUpdateUserController = new AdminUpdateUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 201 and user updated on body if user is successfully updated", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "admin-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersActions.create({
      id: "fake-id",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const fakeRequest = {
      user: {
        id: "admin-id",
      },
      body: {
        user_id_to_be_updated: "fake-id",
        name: "new name",
        email: "new-email@example.com",
      }
    }

    const result = await adminUpdateUserController.handle(fakeRequest);

    const expectedResponse = {
      id: "fake-id",
      name: "new name",
      email: "new-email@example.com",
    };

    expect(result.body).toEqual(expectedResponse);
    expect(result.statusCode).toBe(201);
  });

  it("should return status code 400 if name or email or user_id_to_be_updated are missing", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "admin-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    const fakeRequest = {
      user: {
        id: "admin-id",
      },
      body: {
      }
    }

    const result = await adminUpdateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(`Missing parameter(s): name, email, user_id_to_be_updated.`);
  });

  it("should return status code 401 if user id is missing", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    await usersActions.create({
      id: "admin-id",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    const fakeRequest = {
      user: {
      },
      body: {
        user_id_to_be_updated: "fake-id",
        name: "new name",
        email: "new-email@example.com",
      }
    }

    const result = await adminUpdateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(401);
    expect(result.body).toEqual(`Admin user is not authenticated!`);
  });

  it("should return status code 403 when trying to update user email with an already taken email", async () => {
    const usersActions = container.resolve(UsersActions);

    const dateNow = new Date();

    const adminEmail = "admin@example.com";

    await usersActions.create({
      id: "admin-id",
      name: "Admin",
      email: adminEmail,
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: true,
    });

    await usersActions.create({
      id: "fake-id",
      name: "User",
      email: "user@example.com",
      password: "password",
      createdAt: dateNow,
      updatedAt: dateNow,
      isAdmin: false,
    });

    const fakeRequest = {
      user: {
        id: "admin-id",
      },
      body: {
        user_id_to_be_updated: "fake-id",
        name: "new name",
        email: adminEmail,
      }
    }

    const result = await adminUpdateUserController.handle(fakeRequest);

    expect(result.body).toEqual(`Email: "${adminEmail}" is already taken!`);
    expect(result.statusCode).toBe(403);
  });
})