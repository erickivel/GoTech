import { IEncoder } from "../../src/useCases/users/ports/IEncoder";

export class FakeEncoder implements IEncoder {
  async encode(plain: string): Promise<string> {
    const hash = `${plain}Encripted`;

    return hash;
  };

  async compare(plain: string, hash: string): Promise<boolean> {
    const plainHashed = `${plain}Encripted`;

    if (plainHashed === hash) {
      return true;
    }

    return false;
  };
}