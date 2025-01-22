import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { mock } from 'jest-mock-extended';
import mongoose from 'mongoose';

describe('UserService', () => {
  let service: UserService;
  let userModel: jest.Mocked<Model<User>>;

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashedpassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mock<Model<User>>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name)) as jest.Mocked<Model<User>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userModel).toBeDefined();
  });

  it('should create a new user', async () => {
    const userData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
    };

    (userModel.create as jest.Mock).mockResolvedValue(mockUser as UserDocument);

    const result = await service.create(userData);

    expect(userModel.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(mockUser);
  });

  it('should find a user by email', async () => {
    const email = 'john@example.com';

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser as UserDocument),
    });

    const result = await service.findByEmail(email);

    expect(userModel.findOne).toHaveBeenCalledWith({ email });
    expect(result).toEqual(mockUser);
  });

  it('should find a user by username', async () => {
    const username = 'john_doe';

    userModel.findOne.mockResolvedValue(mockUser as UserDocument);

    const result = await service.findByUsername(username);

    expect(userModel.findOne).toHaveBeenCalledWith({ username });
    expect(result).toEqual(mockUser);
  });

  it('should find a user by id', async () => {
    const id = new mongoose.Types.ObjectId();

    userModel.findOne.mockResolvedValue(mockUser as UserDocument);

    const result = await service.findById(id);

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: id });
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const id = new mongoose.Types.ObjectId();
    const newData = { username: 'john_updated' };

    const updatedUser = { ...mockUser, ...newData };
    userModel.findOneAndUpdate.mockResolvedValue(updatedUser as UserDocument);

    const result = await service.updateUser(id, newData);

    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id },
      newData,
      { runValidators: true, new: true }
    );
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    const id = new mongoose.Types.ObjectId();

    userModel.findOneAndDelete.mockResolvedValue(mockUser as UserDocument);

    const result = await service.deleteUser(id);

    expect(userModel.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
    expect(result).toBe(true);

    userModel.findOneAndDelete.mockResolvedValue(null);
    const resultWhenNotFound = await service.deleteUser(id);
    expect(resultWhenNotFound).toBe(false);
  });
});
