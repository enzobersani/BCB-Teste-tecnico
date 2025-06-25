import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [ClientsModule],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService
    },
    AuthGuard
  ],
  exports: ['IAuthService', AuthGuard],
})
export class AuthModule {}
