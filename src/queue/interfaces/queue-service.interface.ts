import { Message } from "src/messages/entities/message.entity";

export interface IQueueService {
    enqueue(message: Message);
    getQueueStatus();
}