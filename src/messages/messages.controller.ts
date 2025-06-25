import { Body, Controller, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessagesService } from './messages.service';
import { AuthClient } from 'src/auth/decorators/client.decorator';
import { Client } from 'src/clients/entities/client.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { IMessagesService } from './interfaces/messages-service.interface';

@ApiTags('Messages')
@Controller('api/v1/messages')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-client-doc',
  description: 'CPF ou CNPJ do cliente autenticado',
  required: true,
})
export class MessagesController {
    constructor(
      @Inject('IMessagesService')
      private readonly messagesService: IMessagesService) {}

  /**
   * Enviar nova mensagem
   * POST /messages
   */
  @Post()
  async send(
    @AuthClient() client: Client,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(client, dto);
  }

  /**
   * Listar mensagens com filtros
   * GET /messages?conversationId=...&status=...
   */
  @ApiQuery({ name: 'conversationId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @Get()
  async findAll(
    @AuthClient() client: Client,
    @Query('conversationId') conversationId?: string,
    @Query('status') status?: string,
  ) {
    return this.messagesService.findAllMessages(client.id, {
      conversationId,
      status,
    });
  }

  /**
   * Obter detalhes de uma mensagem
   * GET /messages/:id
   */
  @Get(':id')
  async findOne(
    @AuthClient() client: Client,
    @Param('id') id: string,
  ) {
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException('Mensagem não encontrada');
    }
    if (message.senderId !== client.id) {
      throw new ForbiddenException('Acesso negado');
    }
    return message;
  }

  /**
   * Obter status de uma mensagem
   * GET /messages/:id/status
   */
  @Get(':id/status')
  async getStatus(
    @AuthClient() client: Client,
    @Param('id') id: string,
  ) {
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException('Mensagem não encontrada');
    }
    if (message.senderId !== client.id) {
      throw new ForbiddenException('Acesso negado');
    }
    return {
      id: message.id,
      status: message.status,
    };
  }
}
