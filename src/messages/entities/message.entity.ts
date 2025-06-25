import { Client } from "src/clients/entities/client.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    conversationId: string;
  
    @ManyToOne(() => Client)
    sender: Client;
  
    @Column()
    senderId: string;
  
    @Column()
    recipientId: string;
  
    @Column()
    content: string;
  
    @CreateDateColumn()
    timestamp: Date;
  
    @Column()
    priority: 'normal' | 'urgent';
  
    @Column()
    status: 'queued' | 'processing' | 'sent' | 'failed';
  
    @Column({ type: 'decimal', precision: 5, scale: 2 })
    cost: number;

    @Column({ default: 0 })
    retryCount: number;
}