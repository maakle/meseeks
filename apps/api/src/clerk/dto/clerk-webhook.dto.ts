import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Email address schema
const EmailAddressSchema = z.object({
  email_address: z.string().email(),
  id: z.string(),
  linked_to: z.array(z.any()),
  object: z.literal('email_address'),
  verification: z.object({
    status: z.string(),
    strategy: z.string(),
  }),
});

// Phone number schema
const PhoneNumberSchema = z.object({
  phone_number: z.string(),
  id: z.string(),
  linked_to: z.array(z.any()),
  object: z.literal('phone_number'),
  verification: z.object({
    status: z.string(),
    strategy: z.string(),
  }),
});

// User data schema for created and updated events
const UserDataSchema = z.object({
  birthday: z.string().optional(),
  created_at: z.number(),
  email_addresses: z.array(EmailAddressSchema),
  external_accounts: z.array(z.any()),
  external_id: z.string().nullable(),
  first_name: z.string().nullable(),
  gender: z.string().optional(),
  id: z.string(),
  image_url: z.string().nullable(),
  last_name: z.string().nullable(),
  last_sign_in_at: z.number().nullable(),
  object: z.literal('user'),
  password_enabled: z.boolean(),
  phone_numbers: z.array(PhoneNumberSchema),
  primary_email_address_id: z.string().nullable(),
  primary_phone_number_id: z.string().nullable(),
  primary_web3_wallet_id: z.string().nullable(),
  private_metadata: z.record(z.any()),
  profile_image_url: z.string().nullable(),
  public_metadata: z.record(z.any()),
  two_factor_enabled: z.boolean(),
  unsafe_metadata: z.record(z.any()),
  updated_at: z.number(),
  username: z.string().nullable(),
  web3_wallets: z.array(z.any()),
});

// User data schema for deleted events
const DeletedUserDataSchema = z.object({
  deleted: z.literal(true),
  id: z.string(),
  object: z.literal('user'),
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

// User created event
export const UserCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.created'),
  data: UserDataSchema,
});

// User updated event
export const UserUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.updated'),
  data: UserDataSchema,
});

// User deleted event
export const UserDeletedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.deleted'),
  data: DeletedUserDataSchema,
});

// Generic webhook event schema that accepts any of the three types
export const ClerkWebhookEventSchema = z.object({
  type: z.enum(['user.created', 'user.updated', 'user.deleted']),
  data: z.union([UserDataSchema, DeletedUserDataSchema]),
  event_attributes: EventAttributesSchema,
  object: z.literal('event'),
  timestamp: z.number(),
});

export class ClerkWebhookEventDto extends createZodDto(
  ClerkWebhookEventSchema,
) {}

// Type exports for convenience
export type ClerkWebhookEvent = z.infer<typeof ClerkWebhookEventSchema>;
export type UserCreatedEvent = z.infer<typeof UserCreatedEventSchema>;
export type UserUpdatedEvent = z.infer<typeof UserUpdatedEventSchema>;
export type UserDeletedEvent = z.infer<typeof UserDeletedEventSchema>;

// Type guard functions to safely check event types
export const isUserCreatedEvent = (
  event: ClerkWebhookEvent,
): event is UserCreatedEvent => {
  return event.type === 'user.created' && !('deleted' in event.data);
};

export const isUserUpdatedEvent = (
  event: ClerkWebhookEvent,
): event is UserUpdatedEvent => {
  return event.type === 'user.updated' && !('deleted' in event.data);
};

export const isUserDeletedEvent = (
  event: ClerkWebhookEvent,
): event is UserDeletedEvent => {
  return event.type === 'user.deleted' && 'deleted' in event.data;
};
