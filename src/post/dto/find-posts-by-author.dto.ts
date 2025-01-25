import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindPostByAuthorDto {
  @IsMongoId()
  @Field(() => String)
  authorId!: Types.ObjectId;
}
