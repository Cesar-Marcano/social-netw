import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ICurrentUser } from '../types/current-user.type';
import { Payload } from '../types/payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'default_jwt_secret',
      ),
    });
  }

  async validate(payload: Payload): Promise<ICurrentUser> {
    return {
      userId: payload.sub,
      email: payload.email,
      tokenType: payload.type,
    };
  }
}
