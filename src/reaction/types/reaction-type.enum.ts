import { registerEnumType } from '@nestjs/graphql';

export enum ReactionType {
  HAHA = 'haha',
  LOVE = 'love',
  SAD = 'sad',
  WOW = 'wow',
  LIKE = 'like',
  ANGRY = 'angry',
}

// Registers the ReactionType enum in GraphQL schema
registerEnumType(ReactionType, {
  name: 'ReactionType',
});
