import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import CreateCommentDto from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { Comment, CommentDocument } from './comment.schema';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

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
}
