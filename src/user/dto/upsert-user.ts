import { CreateUserSchema } from '../schema';
import { createZodDto } from 'nestjs-zod';

export class UpsertUserDto extends createZodDto(CreateUserSchema) {}
