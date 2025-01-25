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

  /**
   * Creates a new comment.
   *
   * This method checks if the author and the post exist. If both are valid, it creates a new comment.
   *
   * @param comment - The comment object to be created.
   * @returns A promise that resolves to the created comment document.
   * @throws NotFoundException if the author or the post is not found.
   */
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

  /**
   * Retrieves comments for a specific post.
   *
   * This method allows pagination for retrieving comments. It returns the comments for the given post
   * along with the total count of comments.
   *
   * @param postId - The ID of the post to get comments for.
   * @param page - The page number for pagination.
   * @param limit - The number of comments per page.
   * @returns A promise that resolves to a pagination response containing comments and the total count.
   * @throws BadRequestException if the page or limit is less than 1.
   */
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

  /**
   * Updates an existing comment.
   *
   * This method allows an authorized user (the author of the comment) to update the content of a comment.
   *
   * @param commentId - The ID of the comment to be updated.
   * @param commentData - The new data for the comment.
   * @param userId - The ID of the user performing the update.
   * @returns A promise that resolves to the updated comment document.
   * @throws UnauthorizedException if the user is not the author of the comment.
   * @throws NotFoundException if the comment is not found.
   */
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

  /**
   * Deletes a comment.
   *
   * This method allows an authorized user (the author of the comment) to delete a comment.
   *
   * @param commentId - The ID of the comment to be deleted.
   * @param userId - The ID of the user performing the delete action.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   * @throws UnauthorizedException if the user is not the author of the comment.
   * @throws NotFoundException if the comment is not found.
   */
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

  /**
   * Finds a comment by its ID.
   *
   * This helper method is used to retrieve a comment by its unique identifier.
   *
   * @param commentId - The ID of the comment to be found.
   * @returns A promise that resolves to the comment document.
   * @throws NotFoundException if the comment is not found.
   */
  async findCommentById(commentId: Types.ObjectId): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) throw new NotFoundException('Comment not found.');

    return comment;
  }

  /**
   * Check if the comment exists.
   *
   * @param commentId - The ObjectId of the comment.
   * @throws NotFoundException if the comment cannot be found.
   */
  async checkIfCommentExists(commentId: Types.ObjectId): Promise<void> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) throw new NotFoundException('Comment not found.');
  }
}
