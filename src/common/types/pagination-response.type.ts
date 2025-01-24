import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class PaginationResponse<T> {
  @Field()
  totalCount!: number;
  
  @Field()
  data!: T[];
}
