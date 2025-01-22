import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';
import { PostPrivacy } from './types/post-privacy.enum';

export type PostDocument = HydratedDocument<Post> & {
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, ref: 'User', type: mongoose.Types.ObjectId })
  author!: User;

  @Prop({ required: true, min: 1, max: 255 })
  title!: string;

  @Prop({ required: true, min: 1, max: 1024 })
  content!: string;

  @Prop({ enum: PostPrivacy, default: PostPrivacy.PUBLIC })
  privacy!: PostPrivacy;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ title: 'text', content: 'text' });
