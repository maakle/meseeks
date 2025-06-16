import { z } from 'zod';

export const CreateApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required'),
  expiresAt: z.string().datetime().optional(),
});

export const ApiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  prefix: z.string(),
  organizationId: z.string(),
  lastUsedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean(),
});
