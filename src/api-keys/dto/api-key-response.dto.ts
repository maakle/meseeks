import { ApiKey } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import { ApiKeyResponseSchema } from '../schema';

export class ApiKeyResponseDto extends createZodDto(ApiKeyResponseSchema) {}

export const mapToApiKeyResponseDto = (prisma: ApiKey): ApiKeyResponseDto => {
  return ApiKeyResponseDto.create({
    id: prisma.id,
    name: prisma.name,
    prefix: prisma.prefix,
    organizationId: prisma.organizationId,
    lastUsedAt: prisma.lastUsedAt,
    expiresAt: prisma.expiresAt,
    isActive: prisma.isActive,
  });
};
