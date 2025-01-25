import { Types } from 'mongoose';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { CurrentUser } from 'src/auth/user.decorator';

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreatePostDto } from './dto/create-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { FindPostByIdDto } from './dto/find-post-by-id.dto';
import { FindPostByTextDto } from './dto/find-post-by-text.dto';
import { FindPostByAuthorDto } from './dto/find-posts-by-author.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './post.schema';
import { PostService } from './post.service';
import { SearchPost } from './types/search-post.type';

@UseGuards(GqlAuthGuard) // Protects all the queries and mutations below, ensuring the user is authenticated
@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // Query to retrieve a post by its ID
  @Query(() => Post)
  async getPost(@Args('postId') postId: string): Promise<PostDocument> {
    // Finds a post by its ObjectId
    return this.postService.findPostById(new Types.ObjectId(postId));
  }

  // Mutation to create a new post
  @Mutation(() => Post)
  async createPost(
    @Args('postContent') postContent: CreatePostDto,
    @CurrentUser() currentUser: ICurrentUser, // Injects the current user
  ): Promise<PostDocument> {
    // Creates a post with the content
    return this.postService.create({
      author: currentUser.userId,
      ...postContent,
    });
  }

  // Mutation to search posts by text terms (title or content)
  @Mutation(() => SearchPost)
  async findPostByText(
    @Args('searchParams') searchParams: FindPostByTextDto, // Search parameters including term, page, and limit
  ): Promise<SearchPost> {
    // Performs the search and returns the results with pagination
    return this.postService.findByText(
      searchParams.searchTerm,
      searchParams.page,
      searchParams.limit,
    );
  }

  // Query to retrieve a post by its ID (alternative query method)
  @Query(() => Post)
  async findPostById(
    @Args('searchParams') searchParams: FindPostByIdDto,
  ): Promise<Post> {
    // Finds and returns a post by its ID
    return this.postService.findPostById(searchParams.postId);
  }

  // TODO: Implement pagination.
  // Query to retrieve posts by a specific author
  @Query(() => [Post])
  async findPostByAuthor(
    @Args('searchParams') searchParams: FindPostByAuthorDto,
  ): Promise<Post[]> {
    // Finds and returns all posts by a specific author
    return this.postService.findPostByAuthor(searchParams.authorId);
  }

  // Mutation to delete a post
  @Mutation(() => Boolean)
  async deletePost(
    @Args('postInfo') postInfo: DeletePostDto,
    @CurrentUser() currentUser: ICurrentUser, // Injects the current user
  ): Promise<boolean> {
    // Deletes a post only if the current user is the author of the post
    return this.postService.deletePost(postInfo.postId, currentUser.userId);
  }

  // Mutation to update a post
  @Mutation(() => Post)
  async updatePost(
    @Args('postInfo') postInfo: UpdatePostDto,
    @CurrentUser() currentUser: ICurrentUser, // Injects the current user
  ): Promise<Post> {
    // Updates the post with the provided content if the current user is the author
    return this.postService.updatePost(
      postInfo.postId,
      postInfo.newPostContent,
      currentUser.userId,
    );
  }
}
