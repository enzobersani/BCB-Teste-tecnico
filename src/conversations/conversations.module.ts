import { forwardRef, Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesService } from 'src/messages/messages.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    AuthModule,
    forwardRef(() => MessagesModule)
  ],
  controllers: [ConversationsController],
  providers: [
    {
      provide: 'IConversationsService',
      useClass: ConversationsService
    }
  ],
  exports: ['IConversationsService'],
})
export class ConversationsModule {}
