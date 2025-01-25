import { IsMongoId, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class CreateCommentDto {
  @IsMongoId()
  @Field(() => String)
  post!: Types.ObjectId;

  @IsString()
  @Length(1, 512)
  content!: string;
}
