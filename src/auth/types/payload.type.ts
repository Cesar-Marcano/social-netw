import { Types } from 'mongoose';
import { TokenType } from './token-type.enum';

export interface Payload {
  email: string;
  sub: Types.ObjectId;
  type: TokenType;
}
