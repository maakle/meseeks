import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { ApiKey, Organization } from 'generated/prisma/client';
import {
  ApiKeyResponseDto,
  mapToApiKeyResponseDto,
} from '../../api-keys/dto/api-key-response.dto';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'clx1234567890abcdef'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Organization slug',
    example: 'acme-corp'
  })
  @IsString()
  slug!: string;

  @ApiProperty({
    description: 'Organization image URL',
    example: 'https://example.com/image.jpg',
    nullable: true
  })
  @IsString()
  imageUrl!: string | null;

  @ApiProperty({
    description: 'Organization logo URL',
    example: 'https://example.com/logo.png',
    nullable: true
  })
  @IsString()
  logoUrl!: string | null;

  @ApiProperty({
    description: 'User ID who created the organization',
    example: 'clx1234567890abcdef',
    nullable: true
  })
  @IsString()
  createdBy!: string | null;

  @ApiProperty({
    description: 'Organization API keys',
    type: [ApiKeyResponseDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiKeyResponseDto)
  apiKeys!: ApiKeyResponseDto[];
}

export const mapToOrganizationResponseDto = (
  prisma: Organization & { apiKeys: ApiKey[] }
): OrganizationResponseDto => {
  return {
    id: prisma.id,
    name: prisma.name,
    slug: prisma.slug,
    imageUrl: prisma.imageUrl,
    logoUrl: prisma.logoUrl,
    createdBy: prisma.createdBy,
    apiKeys: prisma.apiKeys.map(mapToApiKeyResponseDto),
  };
};
