import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeletePostDto {
  @IsMongoId()
  @Field(() => String)
  postId!: Types.ObjectId;
}
