import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UpsertClerkUserSchema = z.object({
  clerkUserId: z.string(),
  email: z.string().email().nullable(),
  phoneNumber: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export class UpsertClerkUserDto extends createZodDto(UpsertClerkUserSchema) {}
