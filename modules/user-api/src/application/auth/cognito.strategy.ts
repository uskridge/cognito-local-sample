import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const COGNITO_AUTH = 'cognito-auth';

export interface Claim {
  sub: string;
  email: string;
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, COGNITO_AUTH) {
  private logger = new Logger(CognitoStrategy.name);

  constructor() {
    const AUTHORITY = `${process.env.COGNITO_ENDPOINT_URL}/${process.env.USER_POOL_ID}`;
    console.info('AUTHORITY:', AUTHORITY);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: process.env.CLIENT_ID,
      issuer: AUTHORITY,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTHORITY}/.well-known/jwks.json`,
      }),
      // passReqToCallback: true, // これをtrueにするとvalidateの第一引数にRequestを使用できる。
    });
  }

  async validate(payload: Claim): Promise<Claim> {
    return payload;
  }
}
