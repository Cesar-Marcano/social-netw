import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseTimestamp } from 'src/common/types/mongoose-timestamp.type';

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export type UserDocument = HydratedDocument<User> & MongooseTimestamp;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, minlength: 3, maxlength: 20 })
  username!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => EMAIL_REGEX.test(value),
      message: 'Invalid email format',
    },
  })
  email!: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'User', default: [] })
  followers?: mongoose.Types.ObjectId[];

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'User', default: [] })
  following?: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
