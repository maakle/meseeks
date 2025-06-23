import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

// Text message DTO
export class TextMessageDto {
  @ApiProperty({
    description: 'Message body text',
    example: 'Hello, how are you?'
  })
  @IsString()
  body!: string;
}

// Audio message DTO
export class AudioMessageDto {
  @ApiProperty({
    description: 'Audio message ID',
    example: 'audio_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'MIME type of the audio',
    example: 'audio/ogg; codecs=opus',
    required: false
  })
  @IsOptional()
  @IsString()
  mime_type?: string;

  @ApiProperty({
    description: 'SHA256 hash of the audio file',
    example: 'a1b2c3d4e5f6...',
    required: false
  })
  @IsOptional()
  @IsString()
  sha256?: string;

  @ApiProperty({
    description: 'Audio filename',
    example: 'voice_message.ogg',
    required: false
  })
  @IsOptional()
  @IsString()
  filename?: string;
}

// Message DTO
export class MessageDto {
  @ApiProperty({
    description: 'Sender phone number',
    example: '1234567890'
  })
  @IsString()
  from!: string;

  @ApiProperty({
    description: 'Message ID',
    example: 'msg_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Message timestamp',
    example: '2024-01-01T12:00:00Z'
  })
  @IsString()
  timestamp!: string;

  @ApiProperty({
    description: 'Message type',
    enum: ['text', 'audio'],
    example: 'text'
  })
  @IsEnum(['text', 'audio'])
  type!: 'text' | 'audio';

  @ApiProperty({
    description: 'Text message content',
    type: TextMessageDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMessageDto)
  text?: TextMessageDto;

  @ApiProperty({
    description: 'Audio message content',
    type: AudioMessageDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AudioMessageDto)
  audio?: AudioMessageDto;
}

// Change value DTO
export class ChangeValueDto {
  @ApiProperty({
    description: 'Messaging product',
    example: 'whatsapp'
  })
  @IsString()
  messaging_product!: string;

  @ApiProperty({
    description: 'Metadata information',
    type: 'object',
    additionalProperties: true
  })
  metadata!: {
    display_phone_number: string;
    phone_number_id: string;
  };

  @ApiProperty({
    description: 'Contact information',
    type: 'array',
    required: false
  })
  @IsOptional()
  @IsArray()
  contacts?: any[];

  @ApiProperty({
    description: 'Messages array',
    type: [MessageDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages?: MessageDto[];
}

// Change DTO
export class ChangeDto {
  @ApiProperty({
    description: 'Change value',
    type: ChangeValueDto
  })
  @ValidateNested()
  @Type(() => ChangeValueDto)
  value!: ChangeValueDto;

  @ApiProperty({
    description: 'Field name',
    example: 'messages'
  })
  @IsString()
  field!: string;
}

// Entry DTO
export class EntryDto {
  @ApiProperty({
    description: 'Entry ID',
    example: 'entry_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Changes array',
    type: [ChangeDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChangeDto)
  changes!: ChangeDto[];
}

// WhatsApp webhook event DTO
export class WhatsappWebhookEventDto {
  @ApiProperty({
    description: 'Object type',
    example: 'whatsapp_business_account'
  })
  @IsString()
  object!: string;

  @ApiProperty({
    description: 'Entries array',
    type: [EntryDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entry!: EntryDto[];
}

// Webhook verification query DTO
export class WebhookVerificationQueryDto {
  @ApiProperty({
    description: 'Hub mode',
    example: 'subscribe'
  })
  @IsString()
  'hub.mode'!: string;

  @ApiProperty({
    description: 'Hub challenge',
    example: 'challenge_string'
  })
  @IsString()
  'hub.challenge'!: string;

  @ApiProperty({
    description: 'Hub verify token',
    example: 'verify_token_string'
  })
  @IsString()
  'hub.verify_token'!: string;
}

// Type guard functions
export const isTextMessage = (message: any): message is MessageDto & { type: 'text'; text: TextMessageDto } => {
  return message?.type === 'text' && message?.text;
};

export const isAudioMessage = (message: any): message is MessageDto & { type: 'audio'; audio: AudioMessageDto } => {
  return message?.type === 'audio' && message?.audio;
};
