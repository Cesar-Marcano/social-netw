import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import mongoose, { Model } from 'mongoose';
import PasswordHasher from './utils/password-hasher';
import Password from './data-object/password.data-object';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async create(userData: User): Promise<UserDocument> {
    userData.password = await PasswordHasher.hash(new Password(userData.password));

    return this.userModel.create(userData);
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select("+password");
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
    if (newData.password) newData.password = await PasswordHasher.hash(new Password(newData.password));

    return this.userModel.findOneAndUpdate({ _id }, newData, {
      runValidators: true,
      new: true,
    });
  }

  public async deleteUser(_id: mongoose.Types.ObjectId): Promise<boolean> {
    return !!(await this.userModel.findOneAndDelete({ _id }));
  }
}
