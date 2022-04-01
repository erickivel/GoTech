import { JwtAuthenticationTokenProvider } from "../../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { IncorrectCredentialsError } from "../../../src/useCases/users/errors/IncorrectCredentialsError";
import { SignInUserUseCase } from "../../../src/useCases/users/SignInUserUseCase";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let bcryptEncoder: BcryptEncoder;
let jwtAuthenticationProvider: JwtAuthenticationTokenProvider;
let signInUserUseCase: SignInUserUseCase;

describe("SignIn User UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    bcryptEncoder = new BcryptEncoder();
    jwtAuthenticationProvider = new JwtAuthenticationTokenProvider()
    signInUserUseCase = new SignInUserUseCase(
      usersRepositoryInMemory, bcryptEncoder, jwtAuthenticationProvider
    );
  })

  it("should return user and token if user is authenticated", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await signInUserUseCase.execute({
      email: "john@example.com",
      password: "password",
    });

    expect(resultOrError.isRight()).toEqual(true);
    expect(resultOrError.value).toHaveProperty("user");
    expect(resultOrError.value).toHaveProperty("token");
  });

  it("should not sign in user if email is incorrect", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await signInUserUseCase.execute({
      email: "wrong-remail@example.com",
      password: "password",
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new IncorrectCredentialsError());
  });

  it("should not sign in user if email is incorrect", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await signInUserUseCase.execute({
      email: "wrong-remail@example.com",
      password: "password",
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new IncorrectCredentialsError());
  });

  it("should not sign in user if password is incorrect", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await signInUserUseCase.execute({
      email: "john@example.com",
      password: "wrong password",
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new IncorrectCredentialsError());
  });
});