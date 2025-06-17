import z from 'zod';
import { createZodDto } from 'nestjs-zod';

// Base schema for email and password
const emailPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
});

export const LoginResponseSchema = z.object({
  access_token: z.string(),
});

// Login schema
export const LoginSchema = emailPasswordSchema;

// Signup schema extends the base schema
export const SignupSchema = emailPasswordSchema;

// Create DTOs
export class SignupDto extends createZodDto(SignupSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
