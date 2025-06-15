import { z } from 'zod';
import { createOrganizationSchema } from '../validation';

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
