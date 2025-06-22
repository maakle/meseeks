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
    apiKeys: prisma.apiKeys.map(mapToApiKeyResponseDto),
  };
};
