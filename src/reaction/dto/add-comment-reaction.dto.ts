import { IsEnum, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

import { ReactionType } from '../types/reaction-type.enum';

@InputType()
export default class AddCommentReactionDto {
  @Field(() => ReactionType)
  @IsEnum(ReactionType)
  type!: ReactionType;

  @Field(() => String)
  @IsMongoId()
  commentId!: Types.ObjectId;
}
