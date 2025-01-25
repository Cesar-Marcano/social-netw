import { Types } from 'mongoose';
import { TokenType } from './token-type.enum';

/**
 * Interface representing the payload of a JWT token.
 * This payload is used to store the necessary information about the user and their token type
 * in the JWT, which is then used to verify and authenticate the user in future requests.
 */
export interface Payload {
  /**
   * The email of the user associated with the token.
   * This is used to identify the user during authentication and authorization.
   */
  email: string;

  /**
   * The unique identifier (ObjectId) of the user in the database.
   * It helps to associate the token with a specific user for access control.
   */
  sub: Types.ObjectId;

  /**
   * The type of token (either 'ACCESS' or 'REFRESH').
   * This helps differentiate between an access token, which is used to grant access to protected resources,
   * and a refresh token, which is used to obtain a new access token when the original one expires.
   */
  type: TokenType;
}
