import { Controller, Get, Inject } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ApiTags } from '@nestjs/swagger';
import { IQueueService } from './interfaces/queue-service.interface';

@ApiTags('Queue')
@Controller('queue')
export class QueueController {
    constructor(
        @Inject('IQueueService')
        private readonly queueService: IQueueService) {}

    @Get('status')
    getStatus() {
        return this.queueService.getQueueStatus();
    }
}
