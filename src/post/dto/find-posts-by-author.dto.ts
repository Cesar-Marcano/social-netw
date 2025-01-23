import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class FindPostByAuthorDto {
  @IsMongoId()
  @Field(() => String)
  authorId!: Types.ObjectId;
}
