import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [
    {
      provide: 'IClientsService',
      useClass: ClientsService
    }
  ],
  exports: ['IClientsService'],
})
export class ClientsModule {}
