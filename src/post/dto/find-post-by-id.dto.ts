import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class FindPostByIdDto {
  @IsMongoId()
  @Field()
  postId!: Types.ObjectId;
}
