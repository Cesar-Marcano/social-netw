import mongoose, { HydratedDocument } from 'mongoose';

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MongooseTimestamp } from '../common/types/mongoose-timestamp.type';

// This represents the type of a Comment document, including mongoose document and timestamp fields
export type CommentDocument = HydratedDocument<Comment> & MongooseTimestamp;

@ObjectType()
@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt` fields
export class Comment {
  @Field(() => ID)
  id?: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
    immutable: true,
  })
  @Field(() => String)
  author!: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    ref: 'Post',
    type: mongoose.Types.ObjectId,
    immutable: true,
  })
  @Field(() => String)
  post!: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 1024 })
  @Field()
  content!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
