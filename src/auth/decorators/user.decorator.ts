import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";



export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {

        const request = ctx.switchToHttp().getRequest();

        if (!request['user']) {
            throw new InternalServerErrorException('User not found(AuthGuard');
        }

        return request['user'];

    }

)