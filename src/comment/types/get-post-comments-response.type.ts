import PaginationResponse from 'src/common/types/pagination-response.type';

import { Field, ObjectType } from '@nestjs/graphql';

import { Comment } from '../comment.schema';

@ObjectType()
export class GetPostCommentsResponse implements PaginationResponse<Comment> {
  @Field()
  totalCount!: number;

  @Field(() => [Comment])
  data!: Comment[];
}
