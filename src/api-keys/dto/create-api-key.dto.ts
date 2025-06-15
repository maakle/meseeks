import { z } from 'zod/v4';
import { createApiKeySchema } from '../validation';

export type CreateApiKeyDto = z.infer<typeof createApiKeySchema>;
