import { IsMongoId, IsString, Length, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

import { Field, InputType } from '@nestjs/graphql';

import { PostPrivacy } from '../types/post-privacy.enum';
import { CreatePostDto } from './create-post.dto';

@InputType()
export class NewPostContentDto implements Partial<CreatePostDto> {
  @Field({ nullable: true })
  @IsString()
  @Length(1, 255)
  @Field()
  title?: string;

  @IsString()
  @Length(1, 1024)
  @Field()
  @Field({ nullable: true })
  content?: string;

  @IsString()
  @Field(() => PostPrivacy, { nullable: true })
  privacy?: PostPrivacy;
}

@InputType()
export class UpdatePostDto {
  @IsMongoId()
  @Field(() => String)
  postId!: Types.ObjectId;

  @ValidateNested()
  @Field(() => NewPostContentDto)
  newPostContent!: NewPostContentDto;
}
