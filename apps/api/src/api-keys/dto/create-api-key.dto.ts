import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required'),
  expiresAt: z.string().datetime().optional(),
});

export class CreateApiKeyDto extends createZodDto(CreateApiKeySchema) {}
