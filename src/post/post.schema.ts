import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseTimestamp } from 'src/common/types/mongoose-timestamp.type';

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PostPrivacy } from './types/post-privacy.enum';

export type PostDocument = HydratedDocument<Post> & MongooseTimestamp;

@ObjectType()
@Schema({ timestamps: true })
export class Post {
  @Field(() => ID)
  id?: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: mongoose.Types.ObjectId })
  @Field(() => String)
  author!: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 255 })
  @Field(() => String)
  title!: string;

  @Prop({ required: true, min: 1, max: 1024 })
  @Field()
  content!: string;

  @Prop({ enum: PostPrivacy, default: PostPrivacy.PUBLIC })
  @Field()
  privacy!: PostPrivacy;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ title: 'text', content: 'text' });
