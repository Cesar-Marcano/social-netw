import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { TokenType } from './types/token-type.enum';

/**
 * GqlAuthGuard is a custom authentication guard for GraphQL endpoints.
 * It extends the AuthGuard from Passport (using JWT strategy) and is responsible for
 * validating JWT tokens sent by the client. This guard ensures that the incoming requests
 * are properly authenticated, by verifying the presence and validity of the JWT token.
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Overriding the getRequest method to extract the request object from the GraphQL context.
   *
   * @param context - The execution context, which is specific to GraphQL.
   * @returns The HTTP request object, which contains the JWT token.
   */
  override getRequest(context: ExecutionContext) {
    return this.getRequestFromContext(context);
  }

  /**
   * Helper method to retrieve the request object from the GraphQL context.
   *
   * @param context - The execution context for the current GraphQL operation.
   * @returns The HTTP request object from the context, allowing access to the JWT token.
   */
  private getRequestFromContext(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context); // Create GraphQL execution context
    return ctx.getContext().req; // Access the 'req' object from the context
  }

  /**
   * Overriding the handleRequest method to customize the logic for handling errors,
   * validating the user, and throwing appropriate exceptions based on the token's validity.
   *
   * @param err - The error (if any) encountered during authentication.
   * @param user - The user object (if authentication was successful).
   * @param _info - GraphQL-related information (not used in this case).
   * @param _context - The execution context for the GraphQL request.
   * @param _status - The HTTP status code (not used in this case).
   * @returns The authenticated user object if the validation succeeds.
   * @throws UnauthorizedException if the authentication fails or the token type is invalid.
   */
  override handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    // If there's an error or if no user is found, throw UnauthorizedException
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // If the token type is 'refresh' (which is not acceptable for access), throw an exception
    if (user.tokenType === TokenType.REFRESH) {
      throw new UnauthorizedException(
        'Expected access token. Received: refresh token.',
      );
    }

    // Return the authenticated user object
    return user;
  }
}
