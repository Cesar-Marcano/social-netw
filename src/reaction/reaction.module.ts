import { CommentModule } from 'src/comment/comment.module';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReactionResolver } from './comment.resolver';
import { Reaction, ReactionSchema } from './reaction.schema';
import { ReactionService } from './reaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    PostModule,
    CommentModule,
    UserModule,
  ],
  providers: [ReactionService, ReactionResolver],
})
export class ReactionModule {}
