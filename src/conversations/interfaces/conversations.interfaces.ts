import { Message } from "src/messages/entities/message.entity";
import { Conversation } from "../entities/conversation.entity";

export interface IConversationsService {
    updateOrCreateConversation(message: Message): Promise<Conversation>;
    findByClient(clientId: string);
    findOne(id: string);
}