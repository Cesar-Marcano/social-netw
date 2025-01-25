import { registerEnumType } from '@nestjs/graphql';

// Enum referencing Post and Comment schemas
export enum ReactionTarget {
  POST = 'Post',
  COMMENT = 'Comment',
}

// Registers the ReactionTarget enum in GraphQL schema
registerEnumType(ReactionTarget, {
  name: 'ReactionTarget',
});
