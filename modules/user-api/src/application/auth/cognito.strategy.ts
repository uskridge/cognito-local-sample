import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';

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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: process.env.CLIENT_ID,
      issuer: `https://cognito-idp.ap-northeast-1.amazonaws.com/${process.env.USER_POOL_ID}`,
      algorithms: ['RS256'],
      secretOrKeyProvider: async (req, idToken, done) => {
        return fetch(
          `${process.env.COGNITO_ENDPOINT_URL}/${process.env.USER_POOL_ID}/.well-known/jwks.json`,
          {
            headers: {
              Authorization:
                'AWS4-HMAC-SHA256 Credential=mock_access_key/20220524/us-east-1/cognito-idp/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date, Signature=asdf'
            }
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const publicKey = jwkToPem(data.keys[0]);
            done(null, publicKey);
          })
          .catch((error) => {
            done(error, null);
          });
      }
      // passReqToCallback: true, // これをtrueにするとvalidateの第一引数にRequestを使用できる。
    });
  }

  async validate(payload: Claim): Promise<Claim> {
    return payload;
  }
}
