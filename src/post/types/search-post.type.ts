import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../post.schema';

@ObjectType()
export class SearchPost {
  @Field(() => [Post])
  posts!: Post[];
  
  @Field(() => Int)
  totalResults!: number;
}
