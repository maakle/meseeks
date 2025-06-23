import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import {
  createEventSchema,
  createWebhookEventSchema,
  DeletedUserDataSchema,
  UserDataSchema,
} from './shared-schemas';

// User created event
export const UserCreatedEventSchema = createEventSchema(
  'user.created',
  UserDataSchema,
);

// User updated event
export const UserUpdatedEventSchema = createEventSchema(
  'user.updated',
  UserDataSchema,
);

// User deleted event
export const UserDeletedEventSchema = createEventSchema(
  'user.deleted',
  DeletedUserDataSchema,
);

// Generic webhook event schema that accepts any of the three types
export const ClerkWebhookEventSchema = createWebhookEventSchema(
  ['user.created', 'user.updated', 'user.deleted'],
  z.union([UserDataSchema, DeletedUserDataSchema]),
);

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
