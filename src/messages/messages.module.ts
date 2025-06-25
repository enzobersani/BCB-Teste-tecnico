import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { QueueModule } from 'src/queue/queue.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ClientsModule,
    QueueModule,
    forwardRef(() => ConversationsModule),
    AuthModule,
    ConversationsModule
  ],
  controllers: [MessagesController],
  providers: [
    {
      provide: 'IMessagesService',
      useClass: MessagesService
    }
  ],
  exports: ['IMessagesService'],
})
export class MessagesModule {}
