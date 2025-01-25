import mongoose, { HydratedDocument } from 'mongoose';

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MongooseTimestamp } from '../common/types/mongoose-timestamp.type';

export type CommentDocument = HydratedDocument<Comment> & MongooseTimestamp;

@ObjectType()
@Schema({ timestamps: true })
export class Comment {
  @Field(() => ID)
  id?: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: mongoose.Types.ObjectId })
  @Field(() => String)
  author!: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: 'Post', type: mongoose.Types.ObjectId })
  @Field(() => String)
  post!: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 1024 })
  @Field()
  content!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
