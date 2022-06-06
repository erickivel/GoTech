import { sign, verify } from 'jsonwebtoken';

import { IAuthenticationTokenProvider } from "../../useCases/authentication/ports/IAuthenticationTokenProvider";
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

  verify(token: string): string | undefined {
    try {
      const { sub } = verify(token, secretKey);

      return sub?.toString();
    } catch (err) {
      return undefined;
    }
  }
}