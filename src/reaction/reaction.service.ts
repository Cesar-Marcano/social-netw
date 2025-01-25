import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Reaction, ReactionDocument } from './reaction.schema';
import { ReactionTarget } from './types/reaction-target.enum';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  /**
   * Adds a reaction to a target (post or comment).
   *
   * @param {Reaction} reactionData - The reaction data, including the author, target, and reaction type.
   * @returns {Promise<ReactionDocument>} - The created reaction document.
   */
  async addReaction(reactionData: Reaction): Promise<ReactionDocument> {
    const reactionExists = await this.reactionModel.findOne({
      author: reactionData.author,
      targetId: reactionData.targetId,
    });

    if (reactionExists) {
      throw new BadRequestException('You cannot react two times.');
    }

    this.userService.checkIfUserExists(reactionData.author);

    if (reactionData.targetType === ReactionTarget.POST) {
      this.postService.checkIfPostExists(reactionData.targetId);
    } else if (reactionData.targetType === ReactionTarget.COMMENT) {
      this.commentService.checkIfCommentExists(reactionData.targetId);
    }

    return this.reactionModel.create(reactionData);
  }

  /**
   * Deletes a reaction.
   *
   * @param {author} Types.ObjectId
   * @param {targetId} Types.ObjectId
   * @param {targetType} ReactionTarget
   * @returns {Promise<boolean>}
   * @throws {NotFoundException}
   */
  async deleteReaction(
    author: Types.ObjectId,
    targetId: Types.ObjectId,
    targetType: ReactionTarget,
  ): Promise<boolean> {
    const reaction = await this.reactionModel.findOneAndDelete({
      author,
      targetId,
      targetType,
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    return true;
  }
}
