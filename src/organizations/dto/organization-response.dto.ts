import { mapToApiKeyResponseDto } from '@/api-keys/dto/api-key-response.dto';
import { Organization, ApiKey } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import { CreateOrganizationSchema } from '../schema';

export class OrganizationResponseDto extends createZodDto(
  CreateOrganizationSchema,
) {}

type OrganizationWithApiKeys = Organization & { apiKeys: ApiKey[] };

export const mapToOrganizationResponseDto = (
  prisma: OrganizationWithApiKeys,
): OrganizationResponseDto => {
  return OrganizationResponseDto.create({
    id: prisma.id,
    name: prisma.name,
    apiKeys: prisma.apiKeys.map(mapToApiKeyResponseDto),
  });
};
