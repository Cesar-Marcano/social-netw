import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { MongoServerError } from 'mongodb';
import PasswordHasher from './utils/password-hasher';
import Password from './data-object/password.data-object';

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

      return this.userModel.create(userData);
    } catch (error) {
      if (error instanceof MongoServerError && error.code)
        if (error.code === 11000) {
          if (error['keyPattern']?.email) {
            throw new BadRequestException('Email in use.');
          }
          if (error['keyPattern']?.username) {
            throw new BadRequestException('Username in use.');
          }
        }
      if (process.env['NODE_ENV']?.toLowerCase() !== 'production') {
        throw error;
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
    const deletedUser = await this.userModel.findOneAndDelete({ _id });
    return deletedUser ? true : false;
  }
}
