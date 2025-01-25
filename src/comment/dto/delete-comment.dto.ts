import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class DeleteCommentDto {
  @IsMongoId()
  @Field(() => String)
  commentId!: Types.ObjectId;
}
