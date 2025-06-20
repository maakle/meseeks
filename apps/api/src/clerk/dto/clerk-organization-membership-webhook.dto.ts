import { z } from 'zod';
import {
  createEventSchema,
  OrganizationMembershipDataSchema,
} from './shared-schemas';

// Specific event types
export const OrganizationMembershipCreatedEventSchema = createEventSchema(
  'organizationMembership.created',
  OrganizationMembershipDataSchema,
);

export const OrganizationMembershipUpdatedEventSchema = createEventSchema(
  'organizationMembership.updated',
  OrganizationMembershipDataSchema,
);

export const OrganizationMembershipDeletedEventSchema = createEventSchema(
  'organizationMembership.deleted',
  OrganizationMembershipDataSchema,
);

// Type definitions
export type OrganizationMembershipCreatedEvent = z.infer<
  typeof OrganizationMembershipCreatedEventSchema
>;

export type OrganizationMembershipUpdatedEvent = z.infer<
  typeof OrganizationMembershipUpdatedEventSchema
>;

export type OrganizationMembershipDeletedEvent = z.infer<
  typeof OrganizationMembershipDeletedEventSchema
>;

// Type guards
export const isOrganizationMembershipCreatedEvent = (
  event: any,
): event is OrganizationMembershipCreatedEvent => {
  return OrganizationMembershipCreatedEventSchema.safeParse(event).success;
};

export const isOrganizationMembershipUpdatedEvent = (
  event: any,
): event is OrganizationMembershipUpdatedEvent => {
  return OrganizationMembershipUpdatedEventSchema.safeParse(event).success;
};

export const isOrganizationMembershipDeletedEvent = (
  event: any,
): event is OrganizationMembershipDeletedEvent => {
  return OrganizationMembershipDeletedEventSchema.safeParse(event).success;
};
