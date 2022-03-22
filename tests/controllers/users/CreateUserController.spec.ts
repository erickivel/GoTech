import { container } from "tsyringe";

import { CreateUserController } from "../../../src/controllers/users/CreateUserController";
import { IEncoder } from "../../../src/useCases/users/ports/IEncoder";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { FakeEncoder } from "../../doubles/FakeEncoder";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

describe("Create User Controller", () => {
  let createUserController: CreateUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<IEncoder>("Encoder", FakeEncoder);
    createUserController = new CreateUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 201 and successful message when user is successfully created", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        email: "john@example.com",
        password: "password"
      }
    }

    const result = await createUserController.handle(fakeRequest);


    expect(result.statusCode).toBe(201);
    expect(result.body).toBe("User Created!");
  });

  it("should return status code 403 when trying to create an existing user", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        email: "john@example.com",
        password: "password"
      }
    }

    await createUserController.handle(fakeRequest);
    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(`User with email "john@example.com" already exists!`);
  });

  it("should return status code 400 when an invalid email is passed", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        email: "invalid-email",
        password: "password"
      }
    }

    const result = await createUserController.handle(fakeRequest);
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(`"invalid-email" is an invalid email`);
  });

  it("should return status code 400 when an invalid name is passed", async () => {
    const fakeRequest = {
      body: {
        name: "1",
        email: "john@example.com",
        password: "password"
      }
    }

    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(`"1" is an invalid name`);
  });

  it("should return status code 400 when an invalid password is passed", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        email: "john@example.com",
        password: "short"
      }
    }

    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Invalid Password");
  });

  it("should return status code 400 when the name is missing", async () => {
    const fakeRequest = {
      body: {
        email: "john@example.com",
        password: "password"
      }
    }

    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): name.")
  });

  it("should return status code 400 when the email is missing", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        password: "password"
      }
    }

    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): email.")
  });

  it("should return status code 400 when the password is missing", async () => {
    const fakeRequest = {
      body: {
        name: "john",
        email: "john@example.com",
      }
    };

    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): password.")
  });

  it("should return status code 400 when the name, email, password are missing", async () => {
    const fakeRequest = {
      body: {
      }
    };

    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): name, email, password.")
  });
})