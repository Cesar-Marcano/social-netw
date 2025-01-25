import mongoose, { Model } from 'mongoose';

import {
  BadRequestException,
  Injectable,
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

  /**
   * Create a new user and hash the password before saving
   * @param userData The user data object to be saved
   * @returns The created user document
   */
  public async create(userData: User): Promise<UserDocument> {
    // Hash the user's password before saving to the database
    userData.password = await PasswordHasher.hash(
      new Password(userData.password),
    );

    // Create and return the user document
    return await this.userModel.create(userData);
  }

  /**
   * Find a user by their email address
   * @param email The email to search for
   * @returns The user document with password field selected
   */
  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  /**
   * Find a user by their username
   * @param username The username to search for
   * @returns The user document, or null if not found
   */
  public async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  /**
   * Find a user by their MongoDB ID
   * @param id The MongoDB ObjectId of the user
   * @returns The user document, or null if not found
   */
  public async findById(
    id: mongoose.Types.ObjectId,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id });
  }

  /**
   * Update a user's data (including password if provided)
   * @param id The user's MongoDB ID
   * @param newData The data to update (fields to update)
   * @returns The updated user document
   */
  public async updateUser(
    id: mongoose.Types.ObjectId,
    newData: Partial<User>,
  ): Promise<UserDocument | null> {
    // If the password is provided, hash it before saving
    if (newData.password)
      newData.password = await PasswordHasher.hash(
        new Password(newData.password),
      );

    // Perform the update and return the updated user document
    return this.userModel.findOneAndUpdate({ _id: id }, newData, {
      runValidators: true,
      new: true,
    });
  }

  /**
   * Delete a user by their MongoDB ID
   * @param id The user's MongoDB ID
   * @returns True if the deletion was successful
   * @throws BadRequestException if the ID format is invalid
   * @throws NotFoundException if the user is not found
   */
  public async deleteUser(id: mongoose.Types.ObjectId): Promise<boolean> {
    // Try to find and delete the user
    const result = await this.userModel.findOneAndDelete({ _id: id });

    // If no user is found, throw a NotFoundException
    if (!result) {
      throw new NotFoundException('User not found for deletion');
    }

    // Return true if deletion is successful
    return true;
  }

  /**
   * Make one user follow another
   * @param followerId The ID of the user who is following
   * @param followingId The ID of the user who is being followed
   * @returns The follower document after updating
   * @throws NotFoundException if any user is not found
   * @throws BadRequestException if the user tries to follow themselves or is already following
   */
  async followUser(
    followerId: mongoose.Types.ObjectId,
    followingId: mongoose.Types.ObjectId,
  ): Promise<UserDocument> {
    // Find both the follower and the following users
    const follower = await this.userModel.findById(followerId);
    const following = await this.userModel.findById(followingId);

    // If either user is not found, throw a NotFoundException
    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    // Prevent the user from following themselves
    if (followerId.equals(followingId)) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Prevent following the same user twice
    if (follower.following!.includes(followingId)) {
      throw new BadRequestException('You are already following this user');
    }

    // Add the following user to the follower's "following" list
    follower.following!.push(followingId);
    await follower.save();

    // Add the follower to the followed user's "followers" list
    following.followers!.push(followerId);
    await following.save();

    // Return the updated follower document
    return follower;
  }
}
