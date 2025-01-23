import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PostPrivacy } from './types/post-privacy.enum';
import { Field, ObjectType } from '@nestjs/graphql';

export type PostDocument = HydratedDocument<Post> & {
  createdAt?: Date;
  updatedAt?: Date;
};

@ObjectType()
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, ref: 'User', type: mongoose.Types.ObjectId })
  @Field(() => String)
  author!: mongoose.Types.ObjectId;
  
  @Prop({ required: true, min: 1, max: 255 })
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
