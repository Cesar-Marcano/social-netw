import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import PaginationResponse from 'src/common/types/pagination-response.type';

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
        'Unexcepted Error: Comment author not found. Try to Log In again.',
      );

    if (!post) throw new NotFoundException('Unexcepted Error: Post not found.');

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
}
