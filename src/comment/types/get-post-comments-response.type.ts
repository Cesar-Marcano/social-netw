import PaginationResponse from 'src/common/types/pagination-response.type';
import { Comment } from '../comment.schema';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPostCommentsResponse implements PaginationResponse<Comment> {
  @Field()
  totalCount!: number;

  @Field(() => [Comment])
  data!: Comment[];
}
