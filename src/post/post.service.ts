import { Model, Types } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  /**
   * Creates a new post.
   *
   * @param post - The post data to be created.
   * @returns The created post document.
   */
  async create(post: Post): Promise<PostDocument> {
    return this.postModel.create(post);
  }

  /**
   * Finds posts by a search term.
   *
   * @param searchTerm - The term to search for in posts.
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of posts per page (default is 10).
   * @returns An object containing an array of posts and the total number of results.
   * @throws BadRequestException if the search term is invalid.
   */
  async findByText(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: PostDocument[]; totalResults: number }> {
    // Validating search term
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

    // Pagination: Ensure page and limit are within valid bounds
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, Math.min(100, limit));

    // Fetching posts and total count based on search term
    const [posts, totalResults] = await Promise.all([
      this.postModel
        .find({ $text: { $search: searchTerm } })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      this.postModel.countDocuments({ $text: { $search: searchTerm } }),
    ]);

    return { posts, totalResults };
  }

  /**
   * Finds all posts by a specific author.
   *
   * @param author - The ObjectId of the author whose posts are to be fetched.
   * @returns An array of posts written by the author.
   */
  async findPostByAuthor(author: Types.ObjectId): Promise<PostDocument[]> {
    return this.postModel.find({ author });
  }

  /**
   * Finds a post by its ID.
   *
   * @param postId - The ObjectId of the post to find.
   * @returns The post document if found.
   * @throws NotFoundException if no post with the given ID is found.
   */
  async findPostById(postId: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  /**
   * Updates a post's content.
   *
   * @param postId - The ObjectId of the post to update.
   * @param content - The content to update in the post.
   * @param userId - The ObjectId of the user requesting the update.
   * @returns The updated post document.
   * @throws UnauthorizedException if the user is not the author of the post.
   * @throws BadRequestException if no content is provided.
   * @throws NotFoundException if the post cannot be found or updated.
   */
  async updatePost(
    postId: Types.ObjectId,
    content: Partial<Post>,
    userId: Types.ObjectId,
  ): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);

    // Ensure the user is the author of the post
    if (post?.author !== userId)
      throw new UnauthorizedException(
        'You must be the author of the post to perform this action.',
      );

    // Ensure some content is provided for the update
    if (!content || Object.keys(content).length === 0) {
      throw new BadRequestException('No content provided for update');
    }

    // Update the post with the new content
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

  /**
   * Deletes a post.
   *
   * @param postId - The ObjectId of the post to delete.
   * @param userId - The ObjectId of the user requesting the deletion.
   * @returns A boolean indicating whether the post was deleted successfully.
   * @throws UnauthorizedException if the user is not the author of the post.
   * @throws NotFoundException if the post cannot be found or deleted.
   */
  async deletePost(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<boolean> {
    const post = await this.postModel.findById(postId);

    // Ensure the user is the author of the post
    if (post?.author !== userId)
      throw new UnauthorizedException(
        'You must be the author of the post to perform this action.',
      );

    // Delete the post from the database
    const result = await this.postModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException('Post not found for deletion');
    }

    return true;
  }

  /**
   * Check if the post exists.
   *
   * @param postId - The ObjectId of the post.
   * @throws NotFoundException if the post cannot be found.
   */
  async checkIfPostExists(postId: Types.ObjectId): Promise<void> {
    const post = await this.postModel.findById(postId);

    if (!post) throw new NotFoundException('Post not found.');
  }
}
