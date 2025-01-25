import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ReactionCount {
  @Field(() => Int)
  haha!: number;

  @Field(() => Int)
  sad!: number;

  @Field(() => Int)
  love!: number;

  @Field(() => Int)
  wow!: number;

  @Field(() => Int)
  angry!: number;

  @Field(() => Int)
  totalReactions!: number;
}
