import { z } from 'zod';

export const OrganizationMembershipResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    email: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    clerkUserId: z.string().nullable(),
  }),
  organization: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    imageUrl: z.string().nullable(),
    logoUrl: z.string().nullable(),
    clerkOrganizationId: z.string(),
  }),
});

export const OrganizationMembershipListResponseSchema = z.array(
  OrganizationMembershipResponseSchema,
);

export type OrganizationMembershipResponse = z.infer<
  typeof OrganizationMembershipResponseSchema
>;

export type OrganizationMembershipListResponse = z.infer<
  typeof OrganizationMembershipListResponseSchema
>;
