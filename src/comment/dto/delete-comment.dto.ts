import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export default class DeleteCommentDto {
  @IsMongoId()
  @Field(() => String)
  commentId!: Types.ObjectId;
}
