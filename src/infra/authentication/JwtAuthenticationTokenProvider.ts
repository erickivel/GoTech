import { sign } from 'jsonwebtoken';

import { IAuthenticationTokenProvider } from "../../useCases/ports/IAuthenticationTokenProvider";
import authConfig from './config';

const { secretKey, expiresIn } = authConfig;

export class JwtAuthenticationTokenProvider implements IAuthenticationTokenProvider {
  generateToken(subject: string): string {
    const token = sign({}, secretKey, {
      subject,
      expiresIn,
    });

    return token;
  }
}