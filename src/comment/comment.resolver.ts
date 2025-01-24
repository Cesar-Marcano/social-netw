import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import CreateCommentDto from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { Comment, CommentDocument } from './comment.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import DeleteCommentDto from './dto/delete-comment.dto';
import PaginationResponse from 'src/common/types/pagination-response.type';
import GetCommentDto from './dto/get-comment.dto';
import GetPostCommentsDto from './dto/get-post-comments.dto';
import { GetPostCommentsResponse } from './types/get-post-comments-response.type';

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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentInfo') commentInfo: DeleteCommentDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<boolean> {
    return this.commentService.deleteComment(
      commentInfo.commentId,
      currentUser.userId,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GetPostCommentsResponse)
  async getPostComments(
    @Args('postInfo') postInfo: GetPostCommentsDto,
  ): Promise<PaginationResponse<Comment>> {
    return this.commentService.getPostComments(
      postInfo.postId,
      postInfo.page,
      postInfo.limit,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Comment)
  async getComment(
    @Args('commentInfo') commentInfo: GetCommentDto,
  ): Promise<Comment> {
    return this.commentService.findCommentById(commentInfo.commentId);
  }
}
