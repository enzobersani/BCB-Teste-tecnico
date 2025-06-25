import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/messages/entities/message.entity';
import { IConversationsService } from './interfaces/conversations.interfaces';

@Injectable()
export class ConversationsService implements IConversationsService{
    constructor(
        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,
    ) {}

    async updateOrCreateConversation(message: Message): Promise<Conversation> {
        const { senderId, recipientId, content, timestamp } = message;

        let conversation = await this.conversationRepo.findOne({
            where: { clientId: senderId, recipientId },
        });

        if (!conversation) {
            conversation = this.conversationRepo.create({
                clientId: senderId,
                recipientId,
                recipientName: recipientId,
                lastMessageContent: content,
                lastMessageTime: timestamp,
                unreadCount: 1,
            });
        } else {
            conversation.lastMessageContent = content;
            conversation.lastMessageTime = timestamp;
            conversation.unreadCount += 1;
        }

        return this.conversationRepo.save(conversation);
    }

    async findByClient(clientId: string) {
        return this.conversationRepo.find({
            where: { clientId },
            order: { updatedAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        return this.conversationRepo.findOne({ where: { id } });
    }
}
