import { GqlAuthGuard } from 'src/auth/auth.guard';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { CurrentUser } from 'src/auth/user.decorator';

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import AddCommentReactionDto from './dto/add-comment-reaction.dto';
import AddPostReactionDto from './dto/add-post-reaction.dto';
import RemoveCommentReactionDto from './dto/remove-comment-reaction.dto';
import RemovePostReactionDto from './dto/remove-post-reaction.dto';
import { Reaction, ReactionDocument } from './reaction.schema';
import { ReactionService } from './reaction.service';
import { ReactionTarget } from './types/reaction-target.enum';

@UseGuards(GqlAuthGuard)
@Resolver()
export class ReactionResolver {
  constructor(private readonly reactionService: ReactionService) {}

  @Mutation(() => Reaction)
  async addReactionToPost(
    @Args('reactionInfo') reactionInfo: AddPostReactionDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<ReactionDocument> {
    return this.reactionService.addReaction({
      author: currentUser.userId,
      reactionType: reactionInfo.type,
      targetId: reactionInfo.postId,
      targetType: ReactionTarget.POST,
    });
  }

  @Mutation(() => Reaction)
  async addReactionToComment(
    @Args('reactionInfo') reactionInfo: AddCommentReactionDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.reactionService.addReaction({
      author: currentUser.userId,
      reactionType: reactionInfo.type,
      targetId: reactionInfo.commentId,
      targetType: ReactionTarget.COMMENT,
    });
  }

  @Mutation(() => Boolean)
  async removeReactionToPost(
    @Args('reactionInfo') reactionInfo: RemovePostReactionDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<boolean> {
    return this.reactionService.deleteReaction(
      currentUser.userId,
      reactionInfo.postId,
      ReactionTarget.POST,
    );
  }

  @Mutation(() => Boolean)
  async removeReactionToComment(
    @Args('reactionInfo') reactionInfo: RemoveCommentReactionDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<boolean> {
    return this.reactionService.deleteReaction(
      currentUser.userId,
      reactionInfo.commentId,
      ReactionTarget.COMMENT,
    );
  }
}
