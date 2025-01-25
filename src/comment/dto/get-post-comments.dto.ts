import { IsInt, IsMongoId, IsPositive } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class GetPostCommentsDto {
  @IsMongoId()
  @Field(() => String)
  postId!: Types.ObjectId;

  @IsInt()
  @IsPositive()
  @Field()
  page!: number;

  @IsInt()
  @IsPositive()
  @Field()
  limit!: number;
}
