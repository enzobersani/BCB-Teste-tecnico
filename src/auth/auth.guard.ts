import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IAuthService } from "./interfaces/auth-service.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const documentId = request.headers['x-client-doc'];
    if (!documentId) {
      throw new UnauthorizedException('Header x-client-doc obrigatório');
    }

    const client = await this.authService.validateClient(documentId);
    request.client = client;

    return true;
  }
}