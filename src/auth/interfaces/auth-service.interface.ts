import { Client } from "src/clients/entities/client.entity";

export interface IAuthService {
    validateClient(documentId: string): Promise<Client>;
}