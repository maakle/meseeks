import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
});

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}
