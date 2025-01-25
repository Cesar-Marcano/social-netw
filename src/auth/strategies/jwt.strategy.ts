import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ICurrentUser } from '../types/current-user.type';
import { Payload } from '../types/payload.type';

/**
 * JwtStrategy is used for authenticating users using JWT (JSON Web Tokens).
 * It integrates with Passport.js and is responsible for extracting the JWT
 * from the Authorization header and validating its payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the JwtStrategy.
   * This constructor sets up Passport with options for JWT extraction,
   * expiration handling, and the secret key used to verify the JWT signature.
   *
   * @param configService - The ConfigService instance to access configuration settings.
   */
  constructor(readonly configService: ConfigService) {
    super({
      // Extract the JWT from the Authorization header as a Bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Ensure that the JWT's expiration is checked.
      ignoreExpiration: false,

      // Set the secret key used to verify the JWT signature.
      secretOrKey: configService.get<string>(
        'JWT_SECRET', // Retrieve the secret from the configuration
        'default_jwt_secret', // Default value if not found in the configuration
      ),
    });
  }

  /**
   * This method is called after the JWT has been successfully validated.
   * It maps the JWT payload to the `ICurrentUser` object, which will
   * be available in the request context for further processing.
   *
   * @param payload - The decoded JWT payload containing user data (email, userId, and token type).
   * @returns A `ICurrentUser` object containing the user data extracted from the payload.
   */
  async validate(payload: Payload): Promise<ICurrentUser> {
    // Return an object containing the user information from the JWT payload.
    return {
      userId: payload.sub, // userId corresponds to the subject of the token (sub)
      email: payload.email, // email is extracted directly from the token payload
      tokenType: payload.type, // token type (e.g., access token or refresh token)
    };
  }
}
