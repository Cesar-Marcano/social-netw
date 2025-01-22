import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/user.schema';
import PasswordHasher from '../user/utils/password-hasher';
import Password from '../user/data-object/password.data-object';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    email: 'john@example.com',
    password: 'hashedpassword',
    username: 'johnDoe',
  } as UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if validation is successful', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(PasswordHasher, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(
        'john@example.com',
        'password123',
      );

      expect(userService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(PasswordHasher.compare).toHaveBeenCalledWith(
        new Password('password123'),
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if validation fails', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(PasswordHasher, 'compare').mockResolvedValue(false);

      const result = await service.validateUser(
        'john@example.com',
        'wrongpassword',
      );

      expect(userService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(PasswordHasher.compare).toHaveBeenCalledWith(
        new Password('wrongpassword'),
        mockUser.password,
      );
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'john@example.com',
        'password123',
      );

      expect(userService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const payload = { email: mockUser.email, sub: mockUser._id };
      jwtService.sign.mockReturnValue('accessToken');

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ accessToken: 'accessToken' });
    });
  });
});
