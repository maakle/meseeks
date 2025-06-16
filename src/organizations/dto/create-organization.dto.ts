import { CreateOrganizationSchema } from '../validation';
import { createZodDto } from 'nestjs-zod';

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}
