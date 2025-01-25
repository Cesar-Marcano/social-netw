import { MongoDuplicateKeyExceptionFilter } from 'src/common/mongo-duplicate-key.filter';

import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { GetAccessTokenDto } from './dto/get-access-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@UseFilters(MongoDuplicateKeyExceptionFilter)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('userData') userData: LoginDto): Promise<string> {
    const user = await this.authService.validateUser(
      userData.email,
      userData.password,
    );
    if (!user) {
      throw new Error('Invalid credentials.');
    }
    const { refreshToken } = await this.authService.login(user);
    return refreshToken;
  }

  @Mutation(() => String)
  async register(@Args('userData') userData: RegisterDto): Promise<string> {
    const { refreshToken } = await this.authService.register(userData);

    return refreshToken;
  }

  @Mutation(() => String)
  async getAccessToken(
    @Args('tokenData') tokenData: GetAccessTokenDto,
  ): Promise<string> {
    const { accessToken } = await this.authService.getAccessToken(
      tokenData.refreshToken,
    );

    return accessToken;
  }
}
