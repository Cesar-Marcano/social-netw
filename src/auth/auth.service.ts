import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Password from '../user/data-object/password.data-object';
import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import PasswordHasher from '../user/utils/password-hasher';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await PasswordHasher.compare(new Password(password), user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
