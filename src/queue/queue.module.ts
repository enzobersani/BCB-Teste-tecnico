import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Message } from 'src/messages/entities/message.entity';
import { QueueController } from './queue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ConversationsModule],
  providers: [
    {
      provide: 'IQueueService',
      useClass: QueueService
    }
  ],
  exports: ['IQueueService'],
  controllers: [QueueController],
})
export class QueueModule {}
