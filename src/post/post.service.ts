import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(post: Post): Promise<PostDocument> {
    return this.postModel.create(post);
  }

  async findByText(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: PostDocument[]; totalResults: number }> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new BadRequestException('Search term must not be empty');
    }

    if (searchTerm.trim().length < 3) {
      throw new BadRequestException(
        'Search term must be at least 3 characters long',
      );
    }

    if (searchTerm.trim().length > 100) {
      throw new BadRequestException(
        'Search term must be less than 100 characters long',
      );
    }

    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, Math.min(100, limit));

    const [posts, totalResults] = await Promise.all([
      this.postModel
        .find({ $text: { $search: searchTerm } })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      this.postModel.countDocuments({ $text: { $search: searchTerm } }),
    ]);

    return { posts, totalResults };
  }

  async findPostByAuthor(author: Types.ObjectId): Promise<PostDocument[]> {
    return this.postModel.find({ author });
  }

  async findPostById(postId: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async updatePost(
    postId: Types.ObjectId,
    content: Partial<Post>,
  ): Promise<PostDocument> {
    if (!content || Object.keys(content).length === 0) {
      throw new BadRequestException('No content provided for update');
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      content,
      { new: true },
    );

    if (!updatedPost) {
      throw new NotFoundException('Post not found for update');
    }

    return updatedPost;
  }

  async deletePost(postId: Types.ObjectId): Promise<boolean> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID format');
    }

    const result = await this.postModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException('Post not found for deletion');
    }

    return true;
  }
}
