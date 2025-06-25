import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanEnum } from '../enums/plan.enum';
import { DocumentEnum } from '../enums/document.enum';

export class CreateClientDto {
  @ApiProperty({ example: 'Empresa XYZ', description: 'Nome do cliente' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  documentId: string;

  @ApiProperty({
    enum: DocumentEnum,
    description: 'Tipo de documento: CPF ou CNPJ',
  })
  @IsEnum(DocumentEnum)
  @IsNotEmpty()
  documentType: DocumentEnum;

  @ApiProperty({
    enum: PlanEnum,
    description: 'Tipo de plano: prepaid (pré-pago) ou postpaid (pós-pago)',
  })
  @IsEnum(PlanEnum)
  @IsNotEmpty()
  planType: PlanEnum;

  @ApiProperty({
    required: false,
    example: 100.0,
    description: 'Saldo inicial (somente para clientes pré-pagos)',
  })
  @ValidateIf((o) => o.planType === PlanEnum.PREPAID)
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({
    required: false,
    example: 500.0,
    description: 'Limite mensal (somente para clientes pós-pagos)',
  })
  @ValidateIf((o) => o.planType === PlanEnum.POSTPAID)
  @IsNumber()
  @Min(0)
  limit: number;
}
