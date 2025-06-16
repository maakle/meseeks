import { ApiKey } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ApiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  prefix: z.string(),
  organizationId: z.string(),
  lastUsedAt: z.string().datetime().nullable(),
  expiresAt: z.string().datetime().nullable(),
  isActive: z.boolean(),
});

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
