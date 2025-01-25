import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseTimestamp } from 'src/common/types/mongoose-timestamp.type';

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PostPrivacy } from './types/post-privacy.enum';

export type PostDocument = HydratedDocument<Post> & MongooseTimestamp;

@ObjectType()
@Schema({ timestamps: true }) // Mongoose schema to auto-manage createdAt and updatedAt fields
export class Post {
  // GraphQL field for the ID of the post
  @Field(() => ID)
  id?: mongoose.Types.ObjectId;

  // Author of the post, referencing the 'User' model. This is required.
  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
    immutable: true,
  })
  @Field(() => String)
  author!: mongoose.Types.ObjectId;

  // Title of the post, required, with a minimum length of 1 and max length of 255 characters.
  @Prop({ required: true, min: 1, max: 255 })
  @Field(() => String)
  title!: string;

  // Content of the post, required, with a minimum length of 1 and max length of 1024 characters.
  @Prop({ required: true, min: 1, max: 1024 })
  @Field()
  content!: string;

  // Privacy setting for the post, using PostPrivacy enum. Defaults to 'PUBLIC'.
  @Prop({ type: String, enum: PostPrivacy, default: PostPrivacy.PUBLIC })
  @Field()
  privacy!: PostPrivacy;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Create text indexes for the 'title' and 'content' fields to improve search performance
PostSchema.index({ title: 'text', content: 'text' });
