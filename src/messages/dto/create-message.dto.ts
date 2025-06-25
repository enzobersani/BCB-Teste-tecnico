import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ description: 'Id da conversa' })
    @IsOptional()
    conversationId: string;
  
    @ApiProperty({ description: 'Id de quem ira receber a mensagem' })
    @IsNotEmpty()
    recipientId: string;
  
    @ApiProperty({ description: 'Conteudo' })
    @IsNotEmpty()
    content: string;
  
    @ApiProperty({ description: 'Prioridade de processamento' })
    @IsEnum(['normal', 'urgent'])
    priority: 'normal' | 'urgent';
}