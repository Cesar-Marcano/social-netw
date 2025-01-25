import { registerEnumType } from '@nestjs/graphql';

export enum PostPrivacy {
  PUBLIC = 'public',
  MUTUAL_FOLLOWERS = 'mutual_followers',
  PRIVATE = 'private',
}

registerEnumType(PostPrivacy, {
  name: 'PostPrivacy',
});
