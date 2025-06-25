import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { QueueService } from 'src/queue/queue.service';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { timestamp } from 'rxjs';
import { ConversationsService } from 'src/conversations/conversations.service';
import { IQueueService } from 'src/queue/interfaces/queue-service.interface';
import { IMessagesService } from './interfaces/messages-service.interface';
import { IClientsService } from 'src/clients/interfaces/clients.interface';

@Injectable()
export class MessagesService implements IMessagesService{
    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
        @Inject('IClientsService')
        private clientsService: IClientsService,
        @Inject('IQueueService')
        private queueService: IQueueService,
        @Inject('IConversationsService')
        private conversationService: ConversationsService
    ) {}


    private getCost(priority: 'normal' | 'urgent'): number {
        return priority === 'urgent' ? 0.5 : 0.25;
    }

    async sendMessage(client: Client, dto: CreateMessageDto) {
        const cost = this.getCost(dto.priority);
      
        if (client.planType === 'prepaid') {
          if (client.balance < cost) throw new BadRequestException('Saldo insuficiente');
        } else {
          if (client.limit < cost) throw new BadRequestException('Limite insuficiente');
        }
      
        let conversationId = dto.conversationId;
      
        if (!conversationId) {
          const tempMessage = this.messageRepo.create({
            ...dto,
            senderId: client.id,
            cost,
            status: 'queued',
            timestamp: new Date(),
          });
      
          const conv = await this.conversationService.updateOrCreateConversation(tempMessage);
          conversationId = conv.id;
        }
      
        const message = this.messageRepo.create({
          ...dto,
          conversationId,
          cost,
          status: 'queued',
          senderId: client.id,
          timestamp: new Date(),
        });
      
        await this.clientsService.updateBalanceOrLimit(client.id, cost);
        const saved = await this.messageRepo.save(message);
        await this.queueService.enqueue(saved);
      
        return {
          id: saved.id,
          status: saved.status,
          cost: saved.cost,
          estimatedDelivery: new Date(),
          currentBalance:
            client.planType === 'prepaid'
              ? client.balance - cost
              : client.limit - cost,
        };
      }

    async findOne(id: string) {
        return this.messageRepo.findOne({ where: { id } });
    }

    async findAllMessages(clientId: string, filters: { conversationId?: string; status?: string }) {
        const query = this.messageRepo.createQueryBuilder('m')
          .where('m.senderId = :clientId', { clientId });
      
        if (filters.conversationId) {
          query.andWhere('m.conversationId = :conversationId', { conversationId: filters.conversationId });
        }
      
        if (filters.status) {
          query.andWhere('m.status = :status', { status: filters.status });
        }
      
        return query.orderBy('m.timestamp', 'DESC').getMany();
    }

    async findByConversation(conversationId: string) {
        return this.messageRepo.find({
            where: { conversationId },
            order: { timestamp: 'ASC' }
        })
    }
}
