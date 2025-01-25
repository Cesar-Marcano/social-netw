import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class RemoveCommentReactionDto {
  @Field(() => String)
  @IsMongoId()
  commentId!: Types.ObjectId;
}
