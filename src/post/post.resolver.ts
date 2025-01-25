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

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Post)
  async getPost(@Args('postId') postId: string): Promise<PostDocument> {
    return this.postService.findPostById(new Types.ObjectId(postId));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args('postContent') postContent: CreatePostDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<PostDocument> {
    return this.postService.create({
      author: currentUser.userId,
      ...postContent,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SearchPost)
  async findPostByText(
    @Args('searchParams') searchParams: FindPostByTextDto,
  ): Promise<SearchPost> {
    return this.postService.findByText(
      searchParams.searchTerm,
      searchParams.page,
      searchParams.limit,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post)
  async findPostById(
    @Args('searchParams') searchParams: FindPostByIdDto,
  ): Promise<Post> {
    return this.postService.findPostById(searchParams.postId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  async findPostByAuthor(
    @Args('searchParams') searchParams: FindPostByAuthorDto,
  ): Promise<Post[]> {
    return this.postService.findPostByAuthor(searchParams.authorId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deletePost(
    @Args('postInfo') postInfo: DeletePostDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<boolean> {
    return this.postService.deletePost(postInfo.postId, currentUser.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args('postInfo') postInfo: UpdatePostDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<Post> {
    return this.postService.updatePost(
      postInfo.postId,
      postInfo.newPostContent,
      currentUser.userId,
    );
  }
}
