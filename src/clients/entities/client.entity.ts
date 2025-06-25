import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    documentId: string;

    @Column()
    documentType: 'CPF' | 'CNPJ';

    @Column()
    planType: 'prepaid' | 'postpaid';

    @Column('float', { default: 0 })
    balance: number;

    @Column('float', { default: 0 })
    limit: number;

    @Column({ default: true })
    active: boolean;
}