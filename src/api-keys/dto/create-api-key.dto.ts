import { CreateApiKeySchema } from '../validation';
import { createZodDto } from 'nestjs-zod';

export class CreateApiKeyDto extends createZodDto(CreateApiKeySchema) {}
