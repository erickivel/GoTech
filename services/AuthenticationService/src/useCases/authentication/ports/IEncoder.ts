export interface IEncoder {
  encode(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
};