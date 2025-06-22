import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'API key name',
    example: 'Production API Key'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Expiration date (ISO string)',
    example: '2024-12-31T23:59:59.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
