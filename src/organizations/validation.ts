import { z } from 'zod/v4';

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
});
