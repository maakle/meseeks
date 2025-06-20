import { z } from 'zod';

export const UpsertClerkOrganizationMembershipSchema = z.object({
  clerkMembershipId: z.string(),
  clerkUserId: z.string(),
  clerkOrganizationId: z.string(),
  role: z.string(),
});

export type UpsertClerkOrganizationMembershipDto = z.infer<
  typeof UpsertClerkOrganizationMembershipSchema
>;
