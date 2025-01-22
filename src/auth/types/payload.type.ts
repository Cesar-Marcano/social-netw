import { Types } from 'mongoose';

export interface Payload {
  email: string;
  sub: Types.ObjectId;
}
