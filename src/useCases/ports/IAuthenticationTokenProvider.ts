export interface IAuthenticationTokenProvider {
  generateToken(subject: string): string;
};