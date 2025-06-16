import { z } from 'zod';
import { ApiKeyResponseDto } from '../api-keys/dto/api-key-response.dto';

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
});

export const OrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiKeys: z.array(z.custom<ApiKeyResponseDto>()),
});
