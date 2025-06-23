import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

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

// Organization membership data DTO
export class OrganizationMembershipDataDto {
  @ApiProperty({
    description: 'Membership ID',
    example: 'membership_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Object type',
    example: 'organization_membership'
  })
  @IsString()
  object!: string;

  @ApiProperty({
    description: 'Role',
    example: 'admin'
  })
  @IsString()
  role!: string;

  // Add other organization membership properties as needed
  [key: string]: any;
}

// Organization membership created event DTO
export class OrganizationMembershipCreatedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'organizationMembership.created'
  })
  @IsString()
  type!: 'organizationMembership.created';

  @ApiProperty({
    description: 'Organization membership data',
    type: OrganizationMembershipDataDto
  })
  @ValidateNested()
  @Type(() => OrganizationMembershipDataDto)
  data!: OrganizationMembershipDataDto;
}

// Organization membership updated event DTO
export class OrganizationMembershipUpdatedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'organizationMembership.updated'
  })
  @IsString()
  type!: 'organizationMembership.updated';

  @ApiProperty({
    description: 'Organization membership data',
    type: OrganizationMembershipDataDto
  })
  @ValidateNested()
  @Type(() => OrganizationMembershipDataDto)
  data!: OrganizationMembershipDataDto;
}

// Organization membership deleted event DTO
export class OrganizationMembershipDeletedEventDto extends BaseEventDto {
  @ApiProperty({
    description: 'Event type',
    example: 'organizationMembership.deleted'
  })
  @IsString()
  type!: 'organizationMembership.deleted';

  @ApiProperty({
    description: 'Organization membership data',
    type: OrganizationMembershipDataDto
  })
  @ValidateNested()
  @Type(() => OrganizationMembershipDataDto)
  data!: OrganizationMembershipDataDto;
}

// Type guards
export const isOrganizationMembershipCreatedEvent = (
  event: any,
): event is OrganizationMembershipCreatedEventDto => {
  return event?.type === 'organizationMembership.created';
};

export const isOrganizationMembershipUpdatedEvent = (
  event: any,
): event is OrganizationMembershipUpdatedEventDto => {
  return event?.type === 'organizationMembership.updated';
};

export const isOrganizationMembershipDeletedEvent = (
  event: any,
): event is OrganizationMembershipDeletedEventDto => {
  return event?.type === 'organizationMembership.deleted';
};
