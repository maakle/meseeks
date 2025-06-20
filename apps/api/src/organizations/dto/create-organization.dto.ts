import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const CreateOrganizationSchema = z.object({
  clerkOrganizationId: z.string().min(1, 'Clerk organization ID is required'),
  name: z.string().min(1, 'Organization name is required'),
  slug: z.string().min(1, 'Organization slug is required'),
});

export class CreateOrganizationDto extends createZodDto(
  CreateOrganizationSchema,
) {}
