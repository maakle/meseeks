import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

// Base event DTO
export class BaseEventDto {
  @ApiProperty({
    description: 'Event attributes',
    type: 'object',
    additionalProperties: false
  })
  event_attributes!: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };

  @ApiProperty({
    description: 'Object type',
    example: 'event'
  })
  @IsString()
  object!: string;

  @ApiProperty({
    description: 'Event timestamp',
    example: 1640995200000
  })
  timestamp!: number;
}

// User data DTO
export class UserDataDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Object type',
    example: 'user'
  })
  @IsString()
  object!: string;

  // Add other user properties as needed
  [key: string]: any;
}

// Deleted user data DTO
export class DeletedUserDataDto {
  @ApiProperty({
    description: 'Deleted flag',
    example: true
  })
  deleted!: boolean;

  @ApiProperty({
    description: 'User ID',
    example: 'user_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Object type',
    example: 'user'
  })
  @IsString()
  object!: string;
}

// User created event DTO
export class UserCreatedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'user.created'
  })
  @IsString()
  type!: 'user.created';

  @ApiProperty({
    description: 'User data',
    type: UserDataDto
  })
  @ValidateNested()
  @Type(() => UserDataDto)
  data!: UserDataDto;
}

// User updated event DTO
export class UserUpdatedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'user.updated'
  })
  @IsString()
  type!: 'user.updated';

  @ApiProperty({
    description: 'User data',
    type: UserDataDto
  })
  @ValidateNested()
  @Type(() => UserDataDto)
  data!: UserDataDto;
}

// User deleted event DTO
export class UserDeletedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'user.deleted'
  })
  @IsString()
  type!: 'user.deleted';

  @ApiProperty({
    description: 'Deleted user data',
    type: DeletedUserDataDto
  })
  @ValidateNested()
  @Type(() => DeletedUserDataDto)
  data!: DeletedUserDataDto;
}

// Generic webhook event DTO that accepts any of the three types
export class ClerkWebhookEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    enum: ['user.created', 'user.updated', 'user.deleted']
  })
  @IsEnum(['user.created', 'user.updated', 'user.deleted'])
  type!: 'user.created' | 'user.updated' | 'user.deleted';

  @ApiProperty({
    description: 'Event data',
    oneOf: [
      { $ref: '#/components/schemas/UserDataDto' },
      { $ref: '#/components/schemas/DeletedUserDataDto' }
    ]
  })
  @ValidateNested()
  @Type(() => Object)
  data!: UserDataDto | DeletedUserDataDto;
}

// Type guard functions to safely check event types
export const isUserCreatedEvent = (
  event: ClerkWebhookEventDto,
): event is UserCreatedEventDto => {
  return event.type === 'user.created' && !('deleted' in event.data);
};

export const isUserUpdatedEvent = (
  event: ClerkWebhookEventDto,
): event is UserUpdatedEventDto => {
  return event.type === 'user.updated' && !('deleted' in event.data);
};

export const isUserDeletedEvent = (
  event: ClerkWebhookEventDto,
): event is UserDeletedEventDto => {
  return event.type === 'user.deleted' && 'deleted' in event.data;
};
