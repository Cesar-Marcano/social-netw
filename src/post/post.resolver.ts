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
}
