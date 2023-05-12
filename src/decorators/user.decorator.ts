import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUserRequest } from 'src/modules/user/types';

export const UserDecorator = createParamDecorator<any, any, IUserRequest>(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    return user as IUserRequest;
  },
);
