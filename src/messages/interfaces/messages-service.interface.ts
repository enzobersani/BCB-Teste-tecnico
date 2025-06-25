import { Client } from "src/clients/entities/client.entity";
import { CreateMessageDto } from "../dto/create-message.dto";

export interface IMessagesService {
    sendMessage(client: Client, dto: CreateMessageDto);
    findOne(id: string);
    findAllMessages(clientId: string, filters: { conversationId?: string; status?: string });
    findByConversation(conversationId: string);
}