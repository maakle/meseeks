import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiKey } from 'generated/prisma/client';

export class ApiKeyResponseDto {
  @ApiProperty({
    description: 'API key ID',
    example: 'clx1234567890abcdef'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'API key name',
    example: 'Production API Key'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'API key prefix',
    example: 'ak_123456'
  })
  @IsString()
  prefix!: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 'clx1234567890abcdef'
  })
  @IsString()
  organizationId!: string;

  @ApiProperty({
    description: 'Last used timestamp',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true
  })
  @IsOptional()
  @IsDateString()
  lastUsedAt!: string | null;

  @ApiProperty({
    description: 'Expiration timestamp',
    example: '2024-12-31T23:59:59.000Z',
    nullable: true
  })
  @IsOptional()
  @IsDateString()
  expiresAt!: string | null;

  @ApiProperty({
    description: 'Whether the API key is active',
    example: true
  })
  @IsBoolean()
  isActive!: boolean;
}

export const mapToApiKeyResponseDto = (prisma: ApiKey): ApiKeyResponseDto => {
  return {
    id: prisma.id,
    name: prisma.name,
    prefix: prisma.prefix,
    organizationId: prisma.organizationId,
    lastUsedAt: prisma.lastUsedAt?.toISOString() || null,
    expiresAt: prisma.expiresAt?.toISOString() || null,
    isActive: prisma.isActive,
  };
};
