import { z } from 'zod';

export const CreateApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required'),
  expiresAt: z.string().datetime().optional(),
});
