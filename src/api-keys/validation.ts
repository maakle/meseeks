import { z } from 'zod/v4';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required'),
  expiresAt: z.string().datetime().optional(),
});
