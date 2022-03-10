import { Either, left, right } from "../../core/logic/Either";
import { InvalidNameError } from "./errors/InvalidName";

type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class User {
  public readonly name: string;
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;

  private constructor(props: UserProps, id?: string) {
    this.name = props.name;
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt;
  }

  static create(props: UserProps, id?: string): Either<InvalidNameError, User> {
    const validate = User.validate(props.name);

    if (validate.isLeft()) {
      return left(validate.value);
    }

    const user = new User(props, id);

    return right(user);
  }

  public static validate(name: string): Either<InvalidNameError, true> {
    if (name.length > 6) {
      return left(new InvalidNameError(name));
    }

    return right(true);
  }
}
