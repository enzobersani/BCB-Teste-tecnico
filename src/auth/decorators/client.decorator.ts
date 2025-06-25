import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Client } from "src/clients/entities/client.entity";

export const AuthClient = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Client => {
        const request = ctx.switchToHttp().getRequest();
        return request.client;
    }
)