import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { QueueModule } from './queue/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients/entities/client.entity';
import { Message } from './messages/entities/message.entity';
import { Conversation } from './conversations/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'juca2011',
      database: process.env.DB_DATABASE || 'bcb',
      entities: [Client, Message, Conversation],
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule, ClientsModule, MessagesModule, ConversationsModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
