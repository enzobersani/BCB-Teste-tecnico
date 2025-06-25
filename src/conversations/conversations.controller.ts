import { Controller, ForbiddenException, Get, Inject, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthClient } from 'src/auth/decorators/client.decorator';
import { Client } from 'src/clients/entities/client.entity';
import { MessagesService } from 'src/messages/messages.service';
import { ConversationsService } from './conversations.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { IConversationsService } from './interfaces/conversations.interfaces';
import { IMessagesService } from 'src/messages/interfaces/messages-service.interface';

@ApiTags('Conversations')
@Controller('api/v1/conversations')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-client-doc',
  description: 'CPF ou CNPJ do cliente autenticado',
  required: true,
})
export class ConversationsController {
  constructor(
    @Inject('IConversationsService')
    private readonly conversationsService: IConversationsService,
    @Inject('IMessagesService')
    private readonly messagesService: IMessagesService,
  ) {}

  /**
   * Lista todas as conversas do cliente logado
   * GET /conversations
   */
  @Get()
  async list(@AuthClient() client: Client) {
    return this.conversationsService.findByClient(client.id);
  }

  /**
   * Detalhes de uma conversa
   * GET /conversations/:id
   */
  @Get(':id')
  async getOne(@AuthClient() client: Client, @Param('id') id: string) {
    const conv = await this.conversationsService.findOne(id);
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientId !== client.id) throw new ForbiddenException('Acesso negado');
    return conv;
  }

  /**
   * Lista de mensagens da conversa
   * GET /conversations/:id/messages
   */
  @Get(':id/messages')
  async listMessages(@AuthClient() client: Client, @Param('id') id: string) {
    const conv = await this.conversationsService.findOne(id);
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientId !== client.id) throw new ForbiddenException('Acesso negado');

    return this.messagesService.findByConversation(id);
  }
}
