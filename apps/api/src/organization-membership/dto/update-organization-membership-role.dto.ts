import { z } from 'zod';

export const UpdateOrganizationMembershipRoleSchema = z.object({
  role: z.string().min(1, 'Role is required'),
});

export type UpdateOrganizationMembershipRoleDto = z.infer<
  typeof UpdateOrganizationMembershipRoleSchema
>;
