import z from 'zod';
import { createUserSchema } from '../validation';

export type UpsertUserDto = z.infer<typeof createUserSchema>;
