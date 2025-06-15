import { ApiKey } from 'generated/prisma/client';

export type ApiKeyResponseDto = {
  id: string;
  name: string;
  prefix: string;
  organizationId: string;
  lastUsedAt: Date;
  expiresAt: Date;
  isActive: boolean;
};

export const mapToApiKeyResponseDto = (prisma: ApiKey): ApiKeyResponseDto => ({
  id: prisma.id,
  name: prisma.name,
  prefix: prisma.prefix,
  organizationId: prisma.organizationId,
  lastUsedAt: prisma.lastUsedAt,
  expiresAt: prisma.expiresAt,
  isActive: prisma.isActive,
});
