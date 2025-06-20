import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Text message schema
const TextMessageSchema = z.object({
  body: z.string(),
});

// Audio message schema
const AudioMessageSchema = z.object({
  id: z.string(),
  mime_type: z.string().optional(),
  sha256: z.string().optional(),
  filename: z.string().optional(),
});

// Message schema
const MessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(['text', 'audio']),
  text: TextMessageSchema.optional(),
  audio: AudioMessageSchema.optional(),
});

// Change value schema
const ChangeValueSchema = z.object({
  messaging_product: z.string(),
  metadata: z.object({
    display_phone_number: z.string(),
    phone_number_id: z.string(),
  }),
  contacts: z.array(z.any()).optional(),
  messages: z.array(MessageSchema).optional(),
});

// Change schema
const ChangeSchema = z.object({
  value: ChangeValueSchema,
  field: z.string(),
});

// Entry schema
const EntrySchema = z.object({
  id: z.string(),
  changes: z.array(ChangeSchema),
});

// WhatsApp webhook event schema
export const WhatsappWebhookEventSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(EntrySchema),
});

// Text message event
export const TextMessageEventSchema = MessageSchema.extend({
  type: z.literal('text'),
  text: TextMessageSchema,
});

// Audio message event
export const AudioMessageEventSchema = MessageSchema.extend({
  type: z.literal('audio'),
  audio: AudioMessageSchema,
});

// Webhook verification query schema
export const WebhookVerificationQuerySchema = z.object({
  'hub.mode': z.string(),
  'hub.challenge': z.string(),
  'hub.verify_token': z.string(),
});

export class WhatsappWebhookEventDto extends createZodDto(
  WhatsappWebhookEventSchema,
) {}

export class WebhookVerificationQueryDto extends createZodDto(
  WebhookVerificationQuerySchema,
) {}

// Type exports for convenience
export type WhatsappWebhookEvent = z.infer<typeof WhatsappWebhookEventSchema>;
export type TextMessageEvent = z.infer<typeof TextMessageEventSchema>;
export type AudioMessageEvent = z.infer<typeof AudioMessageEventSchema>;
export type WebhookVerificationQuery = z.infer<
  typeof WebhookVerificationQuerySchema
>;

// Type guard functions to safely check message types
export const isTextMessage = (message: any): message is TextMessageEvent => {
  return message.type === 'text' && message.text;
};

export const isAudioMessage = (message: any): message is AudioMessageEvent => {
  return message.type === 'audio' && message.audio;
};
