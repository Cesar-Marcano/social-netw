import { Strategy } from 'passport-local';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

/**
 * LocalStrategy is used for authenticating users using their email and password.
 * It is a part of the Passport.js authentication middleware integrated with NestJS.
 * This strategy handles the validation of user credentials during login.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the LocalStrategy.
   * The email field is specified as the username field for Passport,
   * meaning the login form should use "email" as the username field.
   *
   * @param authService - The AuthService instance used to validate user credentials.
   */
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates user credentials during the login process.
   * This method is called by Passport.js after receiving login data.
   *
   * @param email - The email address entered by the user during login.
   * @param password - The password entered by the user during login.
   * @returns The authenticated user if credentials are valid.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async validate(email: string, password: string): Promise<any> {
    // Call the authService to check if the user with the given credentials exists
    const user = await this.authService.validateUser(email, password);

    // If the user is not found or credentials are incorrect, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Return the user object if validation is successful
    return user;
  }
}
