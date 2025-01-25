import { IsNotEmpty, IsString, Length } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { Post } from '../post.schema';
import { PostPrivacy } from '../types/post-privacy.enum';

@InputType()
export class CreatePostDto implements Partial<Post> {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @Field()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  @Field()
  content!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => PostPrivacy)
  privacy!: PostPrivacy;
}
