import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import {
  createEventSchema,
  createWebhookEventSchema,
  DeletedOrganizationDataSchema,
  OrganizationDataSchema,
} from './shared-schemas';

// Organization created event
export const OrganizationCreatedEventSchema = createEventSchema(
  'organization.created',
  OrganizationDataSchema,
);

// Organization updated event
export const OrganizationUpdatedEventSchema = createEventSchema(
  'organization.updated',
  OrganizationDataSchema,
);

// Organization deleted event
export const OrganizationDeletedEventSchema = createEventSchema(
  'organization.deleted',
  DeletedOrganizationDataSchema,
);

// Generic organization webhook event schema
export const ClerkOrganizationWebhookEventSchema = createWebhookEventSchema(
  ['organization.created', 'organization.updated', 'organization.deleted'],
  z.union([OrganizationDataSchema, DeletedOrganizationDataSchema]),
);

export class ClerkOrganizationWebhookEventDto extends createZodDto(
  ClerkOrganizationWebhookEventSchema,
) {}

// Type exports for convenience
export type ClerkOrganizationWebhookEvent = z.infer<
  typeof ClerkOrganizationWebhookEventSchema
>;
export type OrganizationCreatedEvent = z.infer<
  typeof OrganizationCreatedEventSchema
>;
export type OrganizationUpdatedEvent = z.infer<
  typeof OrganizationUpdatedEventSchema
>;
export type OrganizationDeletedEvent = z.infer<
  typeof OrganizationDeletedEventSchema
>;

// Type guard functions to safely check event types
export const isOrganizationCreatedEvent = (
  event: ClerkOrganizationWebhookEvent,
): event is OrganizationCreatedEvent => {
  return event.type === 'organization.created' && !('deleted' in event.data);
};

export const isOrganizationUpdatedEvent = (
  event: ClerkOrganizationWebhookEvent,
): event is OrganizationUpdatedEvent => {
  return event.type === 'organization.updated' && !('deleted' in event.data);
};

export const isOrganizationDeletedEvent = (
  event: ClerkOrganizationWebhookEvent,
): event is OrganizationDeletedEvent => {
  return event.type === 'organization.deleted' && 'deleted' in event.data;
};
