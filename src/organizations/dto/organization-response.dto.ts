import {
  ApiKeyResponseDto,
  mapToApiKeyResponseDto,
} from '@/api-keys/dto/api-key-response.dto';
import { Organization, ApiKey } from 'generated/prisma/client';

export type OrganizationResponseDto = {
  id: string;
  name: string;
  apiKeys: ApiKeyResponseDto[];
};

type OrganizationWithApiKeys = Organization & { apiKeys: ApiKey[] };

export const mapToOrganizationResponseDto = (
  prisma: OrganizationWithApiKeys,
): OrganizationResponseDto => ({
  id: prisma.id,
  name: prisma.name,
  apiKeys: prisma.apiKeys.map(mapToApiKeyResponseDto),
});
