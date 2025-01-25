import { registerEnumType } from '@nestjs/graphql';

// Enum defining possible privacy levels for a post
export enum PostPrivacy {
  // Post is visible to everyone who is logged in
  PUBLIC = 'public',

  // Post is visible only to users who follow both the author and the target
  MUTUAL_FOLLOWERS = 'mutual_followers',

  // Post is visible only to the post's author
  PRIVATE = 'private',
}

// Registers the PostPrivacy enum in GraphQL schema
registerEnumType(PostPrivacy, {
  name: 'PostPrivacy', // The name of the enum in GraphQL schema
});
