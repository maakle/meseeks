import { CreateUserSchema } from '../validation';
import { createZodDto } from 'nestjs-zod';

export class UpsertUserDto extends createZodDto(CreateUserSchema) {}
