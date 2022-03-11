import { Either, left, right } from "../../../core/logic/Either";
import { InvalidEmailError } from "../errors/InvalidEmailError";
import { InvalidNameError } from "../errors/InvalidNameError";
import { InvalidPasswordError } from "../errors/InvalidPasswordError";
import { valid } from "./ValidateEmail";

type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;

  private constructor(props: Omit<UserProps, "createdAt">) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = new Date();
  }

  static create(
    props: Omit<UserProps, "createdAt">
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
    const validate = User.validate(props);

    if (validate.isLeft()) {
      return left(validate.value);
    }

    const user = new User(props);

    return right(user);
  }

  public static validate(
    props: Omit<UserProps, "createdAt">
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, true> {
    const { name, email, password } = props;

    if (!name || name.trim().length > 255 || name.trim().length < 2) {
      return left(new InvalidNameError(name));
    }

    if (!valid(email)) {
      return left(new InvalidEmailError(email));
    }

    if (!password || password.length > 255 || password.length < 6) {
      return left(new InvalidPasswordError());
    }

    return right(true);
  }
}
