import { MongoServerError } from 'mongodb';
import mongoose, { Model } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Password from './data-object/password.data-object';
import { User, UserDocument } from './user.schema';
import PasswordHasher from './utils/password-hasher';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async create(userData: User): Promise<UserDocument> {
    try {
      userData.password = await PasswordHasher.hash(
        new Password(userData.password),
      );

      const newUser = new this.userModel(userData);

      return await newUser.save();
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new BadRequestException('The user already exists.');
      }

      throw new InternalServerErrorException();
    }
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  public async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  public async findById(
    _id: mongoose.Types.ObjectId,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id });
  }

  public async updateUser(
    _id: mongoose.Types.ObjectId,
    newData: Partial<User>,
  ): Promise<UserDocument | null> {
    if (newData.password)
      newData.password = await PasswordHasher.hash(
        new Password(newData.password),
      );

    return this.userModel.findOneAndUpdate({ _id }, newData, {
      runValidators: true,
      new: true,
    });
  }

  public async deleteUser(_id: mongoose.Types.ObjectId): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const result = await this.userModel.findOneAndDelete({ _id });

    if (!result) {
      throw new NotFoundException('User not found for deletion');
    }

    return true;
  }

  async followUser(
    followerId: mongoose.Types.ObjectId,
    followingId: mongoose.Types.ObjectId,
  ): Promise<UserDocument> {
    const follower = await this.userModel.findById(followerId);
    const following = await this.userModel.findById(followingId);

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    if (followerId.equals(followingId)) {
      throw new BadRequestException('You cannot follow yourself');
    }

    if (follower.following!.includes(followingId)) {
      throw new BadRequestException('You are already following this user');
    }

    follower.following!.push(followingId);
    await follower.save();

    following.followers!.push(followerId);
    await following.save();

    return follower;
  }
}
