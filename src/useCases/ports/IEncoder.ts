export interface IEncoder {
  encode(plain: string): Promise<string>;
};