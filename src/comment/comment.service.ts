import { Model, Types } from 'mongoose';
import PaginationResponse from 'src/common/types/pagination-response.type';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async create(comment: Comment): Promise<CommentDocument> {
    const user = await this.userService.findById(comment.author);
    const post = await this.postService.findPostById(comment.post);

    if (!user)
      throw new NotFoundException(
        'Unexpected Error: Comment author not found. Try to Log In again.',
      );

    if (!post) throw new NotFoundException('Unexpected Error: Post not found.');

    return this.commentModel.create(comment);
  }

  async getPostComments(
    postId: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<CommentDocument>> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException(
        'Page and limit should be greater than zero.',
      );
    }

    const skip = (page - 1) * limit;
    const totalCount = await this.commentModel.countDocuments({ post: postId });

    const comments = await this.commentModel
      .find({ post: postId })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: comments,
      totalCount,
    };
  }

  async updateComment(
    commentId: Types.ObjectId,
    commentData: Partial<Comment>,
    userId: Types.ObjectId,
  ): Promise<CommentDocument> {
    const comment = await this.findCommentById(commentId);

    if (comment?.author !== userId)
      throw new UnauthorizedException(
        'You must be the author of the comment to perform this action.',
      );

    const newComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      commentData,
      {
        new: true,
      },
    );

    return newComment!;
  }

  async deleteComment(
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<boolean> {
    const comment = await this.findCommentById(commentId);

    if (comment?.author !== userId)
      throw new UnauthorizedException(
        'You must be the author of the comment to perform this action.',
      );

    const result = await this.commentModel.findByIdAndDelete(commentId);

    return result !== null;
  }

  async findCommentById(commentId: Types.ObjectId): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) throw new NotFoundException('Comment not found.');

    return comment;
  }
}
