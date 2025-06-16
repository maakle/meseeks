import { CreateApiKeySchema } from '../schema';
import { createZodDto } from 'nestjs-zod';

export class CreateApiKeyDto extends createZodDto(CreateApiKeySchema) {}
