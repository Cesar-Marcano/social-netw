import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import Password from '../user/data-object/password.data-object';
import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import PasswordHasher from '../user/utils/password-hasher';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenResponse } from './types/acccess-token-response.type';
import { Payload } from './types/payload.type';
import { RefreshTokenResponse } from './types/refresh-token-response.type';
import { TokenType } from './types/token-type.enum';

/**
 * AuthService is responsible for handling authentication-related operations:
 * - Validating user credentials
 * - Handling user login and registration
 * - Issuing access and refresh tokens
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validate user credentials during login.
   * It checks whether the provided email and password match an existing user.
   *
   * @param email - The user's email address for login
   * @param password - The plain text password provided during login
   * @returns A user document if credentials are valid, otherwise null
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findByEmail(email);

    // If the user is found and the password matches, return the user
    if (
      user &&
      (await PasswordHasher.compare(new Password(password), user.password))
    ) {
      return user;
    }

    // Return null if validation fails
    return null;
  }

  /**
   * Log the user in by issuing a refresh token.
   *
   * @param user - The user document for the logged-in user
   * @returns An object containing the refresh token
   */
  async login(user: UserDocument): Promise<RefreshTokenResponse> {
    // Create the payload for the refresh token (contains user email, ID, and token type)

    const payload: Payload = {
      email: user.email,
      sub: user._id,
      type: TokenType.REFRESH,
    };

    // Sign and return the refresh token, with expiration time fetched from configuration
    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION', // This key fetches the refresh token expiration time from the config
          '30d', // Default expiration time is 30 days
        ),
      }),
    };
  }

  /**
   * Register a new user and return a refresh token.
   * This method creates a new user and issues a refresh token upon successful registration.
   *
   * @param user - The data for the new user (received from the registration DTO)
   * @returns An object containing the refresh token
   */
  async register(user: RegisterDto): Promise<RefreshTokenResponse> {
    // Create a new user from the provided registration data
    const newUser = await this.userService.create(user);

    // Create the payload for the refresh token (contains user email, ID, and token type)
    const payload: Payload = {
      email: newUser.email,
      sub: newUser._id,
      type: TokenType.REFRESH,
    };

    // Sign and return the refresh token, with expiration time fetched from configuration
    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION', // This key fetches the refresh token expiration time from the config
          '30d', // Default expiration time is 30 days
        ),
      }),
    };
  }

  /**
   * Get an access token by verifying and using a refresh token.
   * If the refresh token is valid, an access token is issued for the user.
   *
   * @param refreshToken - The refresh token used to generate a new access token
   * @returns An object containing the access token
   * @throws BadRequestException - If the refresh token is invalid or not provided
   * @throws UnauthorizedException - If the token type is incorrect
   */
  async getAccessToken(refreshToken: string): Promise<AccessTokenResponse> {
    // Verify the refresh token and extract the payload
    const payload = (await this.jwtService.verifyAsync(
      refreshToken,
    )) as Payload | null;

    // If the payload is not found, throw an exception
    if (!payload) {
      throw new BadRequestException('No refresh token provided.');
    }

    // If the token type is not 'refresh', it's invalid. Throw an exception.
    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException(
        'You provided an access token instead of a refresh token.',
      );
    }

    // Create the payload for the access token (contains user email, ID, and token type)
    const accessTokenPayload: Payload = {
      email: payload.email,
      sub: payload.sub,
      type: TokenType.ACCESS,
    };

    // Generate the access token and return it
    const accessToken = this.jwtService.sign(accessTokenPayload);

    return { accessToken };
  }
}
