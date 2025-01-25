import { Types } from 'mongoose';

import { TokenType } from './token-type.enum';

export interface ICurrentUser {
  email: string;
  userId: Types.ObjectId;
  tokenType: TokenType;
}
