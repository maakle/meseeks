import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

// Base event DTO
export class BaseEventDto {
  @ApiProperty({
    description: 'Event attributes',
    type: 'object',
    additionalProperties: true
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

// Organization data DTO
export class OrganizationDataDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'org_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Object type',
    example: 'organization'
  })
  @IsString()
  object!: string;

  // Add other organization properties as needed
  [key: string]: any;
}

// Deleted organization data DTO
export class DeletedOrganizationDataDto {
  @ApiProperty({
    description: 'Deleted flag',
    example: true
  })
  deleted!: boolean;

  @ApiProperty({
    description: 'Organization ID',
    example: 'org_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Object type',
    example: 'organization'
  })
  @IsString()
  object!: string;
}

// Organization created event DTO
export class OrganizationCreatedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'organization.created'
  })
  @IsString()
  type!: 'organization.created';

  @ApiProperty({
    description: 'Organization data',
    type: OrganizationDataDto
  })
  @ValidateNested()
  @Type(() => OrganizationDataDto)
  data!: OrganizationDataDto;
}

// Organization updated event DTO
export class OrganizationUpdatedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'organization.updated'
  })
  @IsString()
  type!: 'organization.updated';

  @ApiProperty({
    description: 'Organization data',
    type: OrganizationDataDto
  })
  @ValidateNested()
  @Type(() => OrganizationDataDto)
  data!: OrganizationDataDto;
}

// Organization deleted event DTO
export class OrganizationDeletedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'organization.deleted'
  })
  @IsString()
  type!: 'organization.deleted';

  @ApiProperty({
    description: 'Deleted organization data',
    type: DeletedOrganizationDataDto
  })
  @ValidateNested()
  @Type(() => DeletedOrganizationDataDto)
  data!: DeletedOrganizationDataDto;
}

// Generic organization webhook event DTO
export class ClerkOrganizationWebhookEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    enum: ['organization.created', 'organization.updated', 'organization.deleted']
  })
  @IsEnum(['organization.created', 'organization.updated', 'organization.deleted'])
  type!: 'organization.created' | 'organization.updated' | 'organization.deleted';

  @ApiProperty({
    description: 'Event data',
    oneOf: [
      { $ref: '#/components/schemas/OrganizationDataDto' },
      { $ref: '#/components/schemas/DeletedOrganizationDataDto' }
    ]
  })
  @ValidateNested()
  @Type(() => Object)
  data!: OrganizationDataDto | DeletedOrganizationDataDto;
}

// Type guard functions to safely check event types
export const isOrganizationCreatedEvent = (
  event: ClerkOrganizationWebhookEventDto,
): event is OrganizationCreatedEventDto => {
  return event.type === 'organization.created' && !('deleted' in event.data);
};

export const isOrganizationUpdatedEvent = (
  event: ClerkOrganizationWebhookEventDto,
): event is OrganizationUpdatedEventDto => {
  return event.type === 'organization.updated' && !('deleted' in event.data);
};

export const isOrganizationDeletedEvent = (
  event: ClerkOrganizationWebhookEventDto,
): event is OrganizationDeletedEventDto => {
  return event.type === 'organization.deleted' && 'deleted' in event.data;
};
