import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { TokenType } from './types/token-type.enum';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  override getRequest(context: ExecutionContext) {
    return this.getRequestFromContext(context);
  }

  private getRequestFromContext(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  override handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (user.tokenType === TokenType.REFRESH) {
      throw new UnauthorizedException(
        'Excepted access token. Received: refresh token.',
      );
    }

    return user;
  }
}
