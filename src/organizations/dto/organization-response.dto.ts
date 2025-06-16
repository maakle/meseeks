import {
  ApiKeyResponseDto,
  mapToApiKeyResponseDto,
} from '../../api-keys/dto/api-key-response.dto';
import { Organization, ApiKey } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const OrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiKeys: z.array(z.custom<ApiKeyResponseDto>()),
});

export class OrganizationResponseDto extends createZodDto(
  OrganizationResponseSchema,
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
