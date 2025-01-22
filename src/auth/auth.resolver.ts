import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials.');
    }
    const { accessToken } = await this.authService.login(user);
    return accessToken;
  }

  @Mutation(() => String)
  async register(@Args('userData') userData: RegisterDto): Promise<string> {
    const { accessToken } = await this.authService.register(userData);

    return accessToken
  }
}
