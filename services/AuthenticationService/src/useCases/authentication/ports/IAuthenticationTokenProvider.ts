export interface IAuthenticationTokenProvider {
  generateToken(subject: string): string;
  verify(token: string): string | undefined;
};