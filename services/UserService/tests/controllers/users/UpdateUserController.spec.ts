import { container } from "tsyringe";

import { UpdateUserController } from "../../../src/controllers/users/UpdateUserController";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { CreateUserUseCase } from "../../../src/useCases/users/CreateUserUseCase";
import { IEncoder } from "../../../src/useCases/users/ports/IEncoder";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../../doubles/UsersActions";

describe("Update User Controller", () => {
  let updateUserController: UpdateUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<IEncoder>("Encoder", BcryptEncoder);
    updateUserController = new UpdateUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 201 and user updated on body if user is successfully updated", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    }

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "new name",
        email: "new-email@example.com",
      }
    }

    const result = await updateUserController.handle(fakeRequest);

    const expectedResponse = {
      id: userOrError.value.id,
      name: "new name",
      email: "new-email@example.com"
    };

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(expectedResponse);
  });

  it("should return status code 201 and user updated on body if user password is successfully updated", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    }

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "password",
        new_password: "newPassword",
        confirm_password: "newPassword"
      }
    }

    const result = await updateUserController.handle(fakeRequest);

    const usersActions = container.resolve(UsersActions);
    const user = await usersActions.findByEmail("john@example.com");

    if (!user?.password) {
      throw new Error("User not found");
    };

    const bcryptEncoder = new BcryptEncoder();
    const passwordMatch = await bcryptEncoder.compare("newPassword", user.password);

    const expectedUpdatedUserResponse = {
      id: userOrError.value.id,
      name: "John",
      email: "john@example.com",
    };

    expect(passwordMatch).toBeTruthy();
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(expectedUpdatedUserResponse);
  });

  it("should return status code 403 if trying to update a user with an already taken email", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name: "User 1",
      email: "user1@example.com",
      password: "password",
    });

    const userOrError = await createUserUseCase.execute({
      name: "User 2",
      email: "user2@example.com",
      password: "password",
    });


    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    }

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "User2",
        email: "user1@example.com",
      },
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(`Email: "user1@example.com" is already taken!`);
  });

  it("should return status code 403 if trying to update a user with an invalid id", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    }

    const invalidId = "invalid-id";

    const fakeRequest = {
      user: {
        id: invalidId,
      },
      body: {
        name: "User2",
        email: "user1@example.com",
      },
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(`User with id "${invalidId}" not found`);
  });

  it("should return status code 403 if trying to update a user with an incorrect old password", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    }

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "wrong-password",
        new_password: "newPassword",
        confirm_password: "newPassword"
      }
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual("Password incorrect");
  });

  it("should return status code 403 if trying to update a user with unmatched new_password and confirm_password", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    };

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "password",
        new_password: "newPassword",
        confirm_password: "different-newPassword"
      }
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual("Passwords not match");
  });

  it("should return status code 403 if trying to update a user with invalid email", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    };

    const invalidEmail = "invalid-email";

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: invalidEmail,
      }
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(`"${invalidEmail}" is an invalid email`);
  });

  it("should return status code 400 if name and email are missing", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    };

    const fakeRequest = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        old_password: "password",
        new_password: "newPassword",
        confirm_password: "different-newPassword"
      }
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): name, email.");
  });

  it("should return status code 400 if id is missing", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    };

    const fakeRequest = {
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "password",
        new_password: "newPassword",
        confirm_password: "different-newPassword"
      }
    };

    const result = await updateUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): user id.");
  });

  it("should return status code 400 if new_password or confirm_password is missing when the old_password is provided", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!userOrError.isRight()) {
      throw new Error("CreateUserUseCase error");
    };

    const fakeRequestWithoutNewPassword = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "password",
        confirm_password: "newPassword"
      }
    };

    const resultWithoutNewPassword = await updateUserController.handle(fakeRequestWithoutNewPassword);

    const fakeRequestWithoutConfirmPassword = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "password",
        new_password: "newPassword",
      }
    };

    const resultWithoutConfirmPassword = await updateUserController.handle(fakeRequestWithoutConfirmPassword);

    const fakeRequestWithoutNewPasswordAndConfirmPassword = {
      user: {
        id: userOrError.value.id,
      },
      body: {
        name: "John",
        email: "john@example.com",
        old_password: "password",
      }
    };

    const resultWithoutNewPasswordAndConfirmPassword = await updateUserController.handle(fakeRequestWithoutNewPasswordAndConfirmPassword);

    expect(resultWithoutNewPassword.statusCode).toBe(400);
    expect(resultWithoutNewPassword.body).toEqual("Missing parameter(s): new_password.");

    expect(resultWithoutConfirmPassword.statusCode).toBe(400);
    expect(resultWithoutConfirmPassword.body).toEqual("Missing parameter(s): confirm_password.");

    expect(resultWithoutNewPasswordAndConfirmPassword.statusCode).toBe(400);
    expect(resultWithoutNewPasswordAndConfirmPassword.body).toEqual("Missing parameter(s): new_password, confirm_password.");
  });
})