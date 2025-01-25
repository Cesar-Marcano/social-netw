import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseTimestamp } from 'src/common/types/mongoose-timestamp.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ReactionTarget } from './types/reaction-target.enum';
import { ReactionType } from './types/reaction-type.enum';

export type ReactionDocument = HydratedDocument<Reaction> & MongooseTimestamp;

@ObjectType()
@Schema({ timestamps: true }) // This decorator enables automatic creation of `createdAt` and `updatedAt` fields in MongoDB
export class Reaction {
  // Author of the reaction, referencing the 'User' model.
  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
    immutable: true,
  })
  @Field(() => String)
  author!: mongoose.Types.ObjectId;

  // The target of the reaction, which can be either a Post or a Comment.
  // This uses refPath to dynamically refer to the target collection based on the targetType.
  @Prop({
    required: true,
    immutable: true,
    refPath: 'targetType', // This means that Mongoose will use the value of 'targetType' to determine which collection to reference
    type: mongoose.Types.ObjectId,
  })
  @Field(() => String)
  targetId!: mongoose.Types.ObjectId;

  // This field defines the type of the target.
  // It uses the ReactionTarget enum to determine whether the target is a Post or a Comment.
  @Prop({
    required: true,
    immutable: true,
    enum: ReactionTarget,
  })
  @Field(() => ReactionTarget)
  targetType!: ReactionTarget;

  // The type of the reaction
  @Prop({ required: true, enum: ReactionType })
  @Field(() => ReactionType)
  reactionType!: ReactionType;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
