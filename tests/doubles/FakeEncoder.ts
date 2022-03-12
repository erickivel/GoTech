import { IEncoder } from "../../src/useCases/ports/IEncoder";

export class FakeEncoder implements IEncoder {
  async encode(plain: string): Promise<string> {
    const hash = `${plain}Encripted`;

    return hash;
  }
}