import { ApiKey, Organization } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import {
  ApiKeyResponseDto,
  mapToApiKeyResponseDto,
} from '../../api-keys/dto/api-key-response.dto';

export const OrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable(),
  logoUrl: z.string().nullable(),
  createdBy: z.string().nullable(),
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
    slug: prisma.slug,
    imageUrl: prisma.imageUrl,
    logoUrl: prisma.logoUrl,
    createdBy: prisma.createdBy,
    apiKeys: prisma.apiKeys.map(mapToApiKeyResponseDto),
  });
};
