import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Organization data schema for created and updated events
const OrganizationDataSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
  object: z.literal('organization'),
  public_metadata: z.record(z.any()),
  private_metadata: z.record(z.any()),
  unsafe_metadata: z.record(z.any()),
});

// Organization data schema for deleted events
const DeletedOrganizationDataSchema = z.object({
  deleted: z.literal(true),
  id: z.string(),
  object: z.literal('organization'),
});

// Event attributes schema
const EventAttributesSchema = z.object({
  http_request: z.object({
    client_ip: z.string(),
    user_agent: z.string(),
  }),
});

// Base event schema
const BaseEventSchema = z.object({
  event_attributes: EventAttributesSchema,
  object: z.literal('event'),
  timestamp: z.number(),
});

// Organization created event
export const OrganizationCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal('organization.created'),
  data: OrganizationDataSchema,
});

// Organization updated event
export const OrganizationUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal('organization.updated'),
  data: OrganizationDataSchema,
});

// Organization deleted event
export const OrganizationDeletedEventSchema = BaseEventSchema.extend({
  type: z.literal('organization.deleted'),
  data: DeletedOrganizationDataSchema,
});

// Generic organization webhook event schema
export const ClerkOrganizationWebhookEventSchema = z.object({
  type: z.enum([
    'organization.created',
    'organization.updated',
    'organization.deleted',
  ]),
  data: z.union([OrganizationDataSchema, DeletedOrganizationDataSchema]),
  event_attributes: EventAttributesSchema,
  object: z.literal('event'),
  timestamp: z.number(),
});

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
