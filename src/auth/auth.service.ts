import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Password from '../user/data-object/password.data-object';
import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import PasswordHasher from '../user/utils/password-hasher';
import { RegisterDto } from './dto/register.dto';
import { Payload } from './types/payload.type';
import { AccessTokenResponse } from './types/acccess-token-response.type';
import { TokenType } from './types/token-type.enum';
import { RefreshTokenResponse } from './types/refresh-token-response.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await PasswordHasher.compare(new Password(password), user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument): Promise<RefreshTokenResponse> {
    const payload: Payload = {
      email: user.email,
      sub: user._id,
      type: TokenType.REFRESH,
    };

    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
          '30d',
        ),
      }),
    };
  }

  async register(user: RegisterDto): Promise<RefreshTokenResponse> {
    const newUser = await this.userService.create(user);

    const payload: Payload = {
      email: newUser.email,
      sub: newUser._id,
      type: TokenType.REFRESH,
    };

    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
          '30d',
        ),
      }),
    };
  }

  async getAccessToken(refreshToken: string): Promise<AccessTokenResponse> {
    const payload = (await this.jwtService.verifyAsync(
      refreshToken,
    )) as Payload | null;

    if (!payload) {
      throw new BadRequestException('No refresh token provided.');
    }

    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException(
        'You provided an access token instead of a refresh token.',
      );
    }

    const accessTokenPayload: Payload = {
      email: payload.email,
      sub: payload.sub,
      type: TokenType.ACCESS,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload);

    return { accessToken };
  }
}
