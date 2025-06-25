import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { IClientsService } from './interfaces/clients.interface';

@Injectable()
export class ClientsService implements IClientsService{
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
    ) {}

    async create(createClienteDto: CreateClientDto): Promise<Client> {
        if (createClienteDto.planType === 'prepaid' && createClienteDto.limit)
            throw new BadRequestException('Clientes pré-pago não podem ter limite.')

        if (createClienteDto.planType === 'postpaid' && createClienteDto.balance)
            throw new BadRequestException('Clientes pós-pago não podem ter saldo');

        const client = this.clientRepository.create(createClienteDto);
        return this.clientRepository.save(client);
    }

    async findAll(): Promise<Client[]> {
        return this.clientRepository.find();
    }

    async findOne(id: string): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) throw new NotFoundException('Cliente não encontrado!');
        return client;
    }

    async getBalanceOrLimit(id: string): Promise<number> {
        const client = await this.findOne(id);
        return client.planType === 'prepaid' ? client.balance : client.limit;
    }

    async findByDocument(documentId: string): Promise<Client> {
        return this.clientRepository.findOne({ where: { documentId } });
    }

    async updateBalanceOrLimit(id: string, amount: number) {
        const client = await this.findOne(id);
        if (client.planType === 'prepaid') {
            client.balance -= amount;
        } else {
            client.limit -= amount;
        }
        return this.clientRepository.save(client);
    }
}
