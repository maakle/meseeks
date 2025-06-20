import { z } from 'zod';

// Common event attributes schema
export const EventAttributesSchema = z.object({
  http_request: z.object({
    client_ip: z.string(),
    user_agent: z.string(),
  }),
});

// Base event schema
export const BaseEventSchema = z.object({
  event_attributes: EventAttributesSchema,
  object: z.literal('event'),
  timestamp: z.number(),
});

// Common organization data schema
export const OrganizationDataSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
    image_url: z.string().nullable(),
    logo_url: z.string().nullable(),
    created_at: z.number(),
    updated_at: z.number(),
    created_by: z.string().nullable(),
    object: z.literal('organization'),
    public_metadata: z.record(z.any()).optional(),
    private_metadata: z.record(z.any()).optional(),
    unsafe_metadata: z.record(z.any()).optional(),
  })
  .passthrough();

// Deleted organization data schema
export const DeletedOrganizationDataSchema = z.object({
  deleted: z.literal(true),
  id: z.string(),
  object: z.literal('organization'),
});

// Email address schema
export const EmailAddressSchema = z.object({
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
export const PhoneNumberSchema = z.object({
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
export const UserDataSchema = z.object({
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

// Deleted user data schema
export const DeletedUserDataSchema = z.object({
  deleted: z.literal(true),
  id: z.string(),
  object: z.literal('user'),
});

// Public user data schema (for organization membership)
export const PublicUserDataSchema = z.object({
  user_id: z.string(),
  identifier: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  image_url: z.string().nullable(),
  profile_image_url: z.string().nullable(),
});

// Organization membership data schema
export const OrganizationMembershipDataSchema = z
  .object({
    id: z.string(),
    object: z.literal('organization_membership'),
    organization: OrganizationDataSchema,
    public_user_data: PublicUserDataSchema,
    role: z.string(),
    created_at: z.number(),
    updated_at: z.number(),
  })
  .passthrough();

// Generic function to create event schemas
export const createEventSchema = <T extends z.ZodTypeAny>(
  eventType: string,
  dataSchema: T,
) => {
  return BaseEventSchema.extend({
    type: z.literal(eventType),
    data: dataSchema,
  });
};

// Generic function to create webhook event schema
export const createWebhookEventSchema = <T extends z.ZodTypeAny>(
  eventTypes: [string, ...string[]],
  dataSchema: T,
) => {
  return z.object({
    type: z.enum(eventTypes),
    data: dataSchema,
    event_attributes: EventAttributesSchema,
    object: z.literal('event'),
    timestamp: z.number(),
  });
};
