import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Message } from 'src/messages/entities/message.entity';
import { Repository, TreeRepository } from 'typeorm';
import { IQueueService } from './interfaces/queue-service.interface';

@Injectable()
export class QueueService implements OnModuleInit, IQueueService{
    private urgentQueue: Message[] = [];
    private normalQueue: Message[] = [];
    private logger = new Logger(QueueService.name);

    private isProcessing = false;
    private urgentCount = 0;
    private readonly MAX_URGENT_BEFORE_NORMAL = 3;

    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>
    ) {}

    onModuleInit() {
        this.startQueueProcessor();
    }

    private startQueueProcessor() {
        setInterval(async () => {
            if (this.isProcessing) return;

            this.isProcessing = true;
            try {
                await this.processNext();
            } finally {
                this.isProcessing = false;
            }
        }, 1000)
    }

    async enqueue(message: Message) {
        if (message.priority === 'urgent')
            this.urgentQueue.push(message);
        else
            this.normalQueue.push(message);

        this.logger.log(`Mensagem enfileirada: ${message.id} (${message.priority})`);
    }

    private async processNext() {
        const nextMessage = this.getNextMessage();

        if (!nextMessage) return;

        try {
            nextMessage.status = 'processing';
            await this.messageRepo.save(nextMessage);

            nextMessage.status = 'sent';
            await this.messageRepo.save(nextMessage);

            this.logger.log(`Mensagem processada: ${nextMessage.id}`);
        } catch (err) {
            nextMessage.retryCount = (nextMessage.retryCount ?? 0) + 1;

            if (nextMessage.retryCount >= 3) {
                nextMessage.status = 'failed';
                this.logger.error(`Falha definitiva ao processar ${nextMessage.id}`);
            } else {
                nextMessage.status = 'queued';
                this.logger.warn(`Erro ao processar ${nextMessage.id}, reprocessando...`);
                this.enqueue(nextMessage);
            }

            await this.messageRepo.save(nextMessage);
        }
    }

    private getNextMessage(): Message | undefined {
        if (
            this.urgentQueue.length && 
            (this.urgentCount < this.MAX_URGENT_BEFORE_NORMAL || this.normalQueue.length === 0)
        ) {
            this.urgentCount++;
            return this.urgentQueue.shift();
        }

        if (this.normalQueue.length) {
            this.urgentCount = 0;
            return this.normalQueue.shift();
        }

        return undefined;
    }

    async getQueueStatus() {
        const urgentQueueSize = this.urgentQueue.length;
        const normalQueueSize = this.normalQueue.length;
        const totalQueued = urgentQueueSize + normalQueueSize;

        const totalProcessed = await this.messageRepo.count({
            where: { status: 'sent' },
        });

        const totalFailed = await this.messageRepo.count({
            where: { status: 'failed' }
        });

        const totalProcessing = await this.messageRepo.count({
            where: { status: 'processing' }
        });

        return {
            urgentQueueSize,
            normalQueueSize,
            totalQueued,
            totalProcessed,
            totalFailed,
            totalProcessing
        };
    }
}
