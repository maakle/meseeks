import z from 'zod/v4';
import { createUserSchema } from '../validation';

export type UpsertUserDto = z.infer<typeof createUserSchema>;
