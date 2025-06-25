import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/auth-service.interface';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('IAuthService')
        private readonly authService: IAuthService
    ) {}

    @Post()
    async login(@Body() dto: AuthDto) {
      const client = await this.authService.validateClient(dto.documentId);
      return {
        clientId: client.id,
        name: client.name,
        documentId: client.documentId,
        planType: client.planType,
        balance: client.balance,
        limit: client.limit,
      };
    }
}
