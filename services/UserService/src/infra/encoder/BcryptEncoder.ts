import { compare, hash } from 'bcrypt';

import { IEncoder } from "../../useCases/users/ports/IEncoder";

export class BcryptEncoder implements IEncoder {
  async encode(plain: string): Promise<string> {
    const hashedString = await hash(plain, 8);

    return hashedString;
  };

  async compare(plain: string, hash: string): Promise<boolean> {
    const isEqual = await compare(plain, hash);

    return isEqual;
  }
};