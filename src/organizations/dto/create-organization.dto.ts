import { z } from 'zod/v4';
import { createOrganizationSchema } from '../validation';

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
