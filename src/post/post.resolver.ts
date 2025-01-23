import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { SearchPost } from './types/search-post.type';
import { FindPostByTextDto } from './dto/find-post-by-text.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { FindPostByIdDto } from './dto/find-post-by-id.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
    return this.postService.updatePost(postInfo.postId, postInfo.newPostContent, currentUser.userId);
  }
}
