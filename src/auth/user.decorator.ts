import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom decorator to extract the current authenticated user from the request.
 * This decorator can be used in GraphQL resolvers to access the user information.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    // Create a GraphQL execution context from the incoming request context
    const ctx = GqlExecutionContext.create(context);

    // Extract the 'user' object from the request context and return it.
    // This assumes that user information has been set in the 'req.user' object (usually by a JWT auth guard or middleware).
    return ctx.getContext().req.user;
  },
);
