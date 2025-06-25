import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';
import { IAuthService } from './interfaces/auth-service.interface';
import { IClientsService } from 'src/clients/interfaces/clients.interface';

@Injectable()
export class AuthService implements IAuthService{
    constructor(
        @Inject('IClientsService')
        private readonly clientsService: IClientsService) {}

    async validateClient(documentId: string): Promise<Client> {
        const client = await this.clientsService.findByDocument(documentId);
        if (!client || !client.active)
            throw new UnauthorizedException('Cliente inválido ou inativo');

        return client;
    }
}
