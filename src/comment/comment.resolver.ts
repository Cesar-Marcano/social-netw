import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import CreateCommentDto from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { Comment, CommentDocument } from './comment.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('commentData') commentData: CreateCommentDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<CommentDocument> {
    return this.commentService.create({
      ...commentData,
      author: currentUser.userId,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @Args('commentInfo') commentInfo: UpdateCommentDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<CommentDocument> {
    return this.commentService.updateComment(
      commentInfo.commentId,
      commentInfo.newCommentContent,
      currentUser.userId,
    );
  }
}
