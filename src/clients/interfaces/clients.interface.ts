import { CreateClientDto } from "../dto/create-client.dto";
import { Client } from "../entities/client.entity";

export interface IClientsService {
    create(createClienteDto: CreateClientDto): Promise<Client>;
    findAll(): Promise<Client[]>;
    findOne(id: string): Promise<Client>;
    getBalanceOrLimit(id: string): Promise<number>
    findByDocument(documentId: string): Promise<Client>
    updateBalanceOrLimit(id: string, amount: number);
}