import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindPostByIdDto {
  @IsMongoId()
  @Field(() => String)
  postId!: Types.ObjectId;
}
