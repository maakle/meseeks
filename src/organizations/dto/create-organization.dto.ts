import { CreateOrganizationSchema } from '../schema';
import { createZodDto } from 'nestjs-zod';

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}
