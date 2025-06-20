import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;

export const UpsertClerkUserSchema = z.object({
  clerkUserId: z.string(),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, {
      message: 'Phone number must be in E.164 format (e.g., +1234567890)',
    })
    .nullable(),
  email: z.string().email().nullable(),
});

export class UpsertClerkUserDto extends createZodDto(UpsertClerkUserSchema) {}
