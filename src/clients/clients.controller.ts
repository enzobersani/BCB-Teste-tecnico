import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { IClientsService } from './interfaces/clients.interface';

@ApiTags('Clients')
@Controller('api/v1/clients')
export class ClientsController {
    constructor(
      @Inject('IClientsService')
      private readonly clientsService: IClientsService) {}

    @Post()
    create(@Body() dto: CreateClientDto) {
      return this.clientsService.create(dto);
    }
  
    @Get()
    findAll() {
      return this.clientsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.clientsService.findOne(id);
    }
  
    // @Put(':id')
    // update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    //   return this.clientsService.update(id, dto);
    // }
  
    @Get(':id/balance')
    getBalance(@Param('id') id: string) {
      return this.clientsService.getBalanceOrLimit(id);
    }
}
