import { z } from 'zod';

export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;

export const CreateUserSchema = z.object({
  phoneNumber: z.string().regex(phoneNumberRegex, {
    message: 'Phone number must be in E.164 format (e.g., +1234567890)',
  }),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  phoneNumber: z.string(),
});
