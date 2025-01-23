import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindPostByTextDto {
  @Field()
  searchTerm!: string;

  @Field(() => Int)
  page?: number;

  @Field(() => Int)
  limit?: number;
}
