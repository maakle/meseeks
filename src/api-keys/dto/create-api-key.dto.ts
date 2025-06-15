import { z } from 'zod';
import { createApiKeySchema } from '../validation';

export type CreateApiKeyDto = z.infer<typeof createApiKeySchema>;
