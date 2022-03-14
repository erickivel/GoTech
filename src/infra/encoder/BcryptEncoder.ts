import { hash } from 'bcrypt';

import { IEncoder } from "../../useCases/ports/IEncoder";

export class BcryptEncoder implements IEncoder {
  encode(plain: string): Promise<string> {
    const hashedString = hash(plain, 8);

    return hashedString;
  };
};