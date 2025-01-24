import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export default class GetCommentDto {
  @IsMongoId()
  @Field(() => String)
  commentId!: Types.ObjectId;
}
