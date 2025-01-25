import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseTimestamp } from 'src/common/types/mongoose-timestamp.type';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Regular expression for validating email format
const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// Type definition for UserDocument, combining the User schema with the timestamp
export type UserDocument = HydratedDocument<User> & MongooseTimestamp;

@Schema({ timestamps: true }) // Enable automatic timestamps (createdAt, updatedAt)
export class User {
  // The username is a required field, must be unique, and has a min/max length constraint
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 20 })
  username!: string;

  // The password is a required field but will not be selected by default when querying
  @Prop({ required: true, select: false })
  password!: string;

  // The email is required, must be unique, and must match a valid email format using the regex
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => EMAIL_REGEX.test(value),
      message: 'Invalid email format',
    },
  })
  email!: string;

  // Array of ObjectIds referencing other User documents who are following this user
  @Prop({ type: [mongoose.Types.ObjectId], ref: 'User', default: [] })
  followers?: mongoose.Types.ObjectId[];

  // Array of ObjectIds referencing other User documents that this user is following
  @Prop({ type: [mongoose.Types.ObjectId], ref: 'User', default: [] })
  following?: mongoose.Types.ObjectId[];
}

// Create the User schema from the class and export it
export const UserSchema = SchemaFactory.createForClass(User);
