import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UpsertClerkOrganizationSchema = z.object({
  clerkOrganizationId: z.string(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  imageUrl: z.string().nullable(),
  logoUrl: z.string().nullable(),
  createdBy: z.string().nullable(),
});

export class UpsertClerkOrganizationDto extends createZodDto(
  UpsertClerkOrganizationSchema,
) {}
