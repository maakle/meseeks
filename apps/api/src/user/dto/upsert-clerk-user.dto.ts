import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;

export const UpsertClerkUserSchema = z.object({
  clerkUserId: z.string(),
  email: z.string().email().nullable(),
});

export class UpsertClerkUserDto extends createZodDto(UpsertClerkUserSchema) {}
