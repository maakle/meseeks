import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

// Common event attributes DTO
export class EventAttributesDto {
    @ApiProperty({
        description: 'HTTP request information',
        type: 'object',
        additionalProperties: false
    })
    @IsObject()
    http_request!: {
        client_ip: string;
        user_agent: string;
    };
}

// Base event DTO
export class BaseEventDto {
    @ApiProperty({
        description: 'Event attributes',
        type: EventAttributesDto
    })
    @ValidateNested()
    @Type(() => EventAttributesDto)
    event_attributes!: EventAttributesDto;

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
    @IsNumber()
    timestamp!: number;
}

// Email address DTO
export class EmailAddressDto {
    @ApiProperty({
        description: 'Email address',
        example: 'user@example.com'
    })
    @IsString()
    email_address!: string;

    @ApiProperty({
        description: 'Email address ID',
        example: 'email_123456'
    })
    @IsString()
    id!: string;

    @ApiProperty({
        description: 'Linked accounts',
        type: 'array'
    })
    @IsArray()
    linked_to!: any[];

    @ApiProperty({
        description: 'Object type',
        example: 'email_address'
    })
    @IsString()
    object!: string;

    @ApiProperty({
        description: 'Verification status',
        type: 'object',
        additionalProperties: true
    })
    @IsObject()
    verification!: {
        status: string;
        strategy: string;
    };
}

// Phone number DTO
export class PhoneNumberDto {
    @ApiProperty({
        description: 'Phone number',
        example: '+1234567890'
    })
    @IsString()
    phone_number!: string;

    @ApiProperty({
        description: 'Phone number ID',
        example: 'phone_123456'
    })
    @IsString()
    id!: string;

    @ApiProperty({
        description: 'Linked accounts',
        type: 'array'
    })
    @IsArray()
    linked_to!: any[];

    @ApiProperty({
        description: 'Object type',
        example: 'phone_number'
    })
    @IsString()
    object!: string;

    @ApiProperty({
        description: 'Verification status',
        type: 'object',
        additionalProperties: true
    })
    @IsObject()
    verification!: {
        status: string;
        strategy: string;
    };
}

// User data DTO for created and updated events
export class UserDataDto {
    @ApiProperty({
        description: 'User birthday',
        required: false
    })
    @IsOptional()
    @IsString()
    birthday?: string;

    @ApiProperty({
        description: 'Created timestamp',
        example: 1640995200000
    })
    @IsNumber()
    created_at!: number;

    @ApiProperty({
        description: 'Email addresses',
        type: [EmailAddressDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmailAddressDto)
    email_addresses!: EmailAddressDto[];

    @ApiProperty({
        description: 'External accounts',
        type: 'array'
    })
    @IsArray()
    external_accounts!: any[];

    @ApiProperty({
        description: 'External ID',
        required: false
    })
    @IsOptional()
    @IsString()
    external_id?: string | null;

    @ApiProperty({
        description: 'First name',
        required: false
    })
    @IsOptional()
    @IsString()
    first_name?: string | null;

    @ApiProperty({
        description: 'Gender',
        required: false
    })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({
        description: 'User ID',
        example: 'user_123456'
    })
    @IsString()
    id!: string;

    @ApiProperty({
        description: 'Image URL',
        required: false
    })
    @IsOptional()
    @IsString()
    image_url?: string | null;

    @ApiProperty({
        description: 'Last name',
        required: false
    })
    @IsOptional()
    @IsString()
    last_name?: string | null;

    @ApiProperty({
        description: 'Last sign in timestamp',
        required: false
    })
    @IsOptional()
    @IsNumber()
    last_sign_in_at?: number | null;

    @ApiProperty({
        description: 'Object type',
        example: 'user'
    })
    @IsString()
    object!: string;

    @ApiProperty({
        description: 'Password enabled',
        example: true
    })
    @IsBoolean()
    password_enabled!: boolean;

    @ApiProperty({
        description: 'Phone numbers',
        type: [PhoneNumberDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhoneNumberDto)
    phone_numbers!: PhoneNumberDto[];

    @ApiProperty({
        description: 'Primary email address ID',
        required: false
    })
    @IsOptional()
    @IsString()
    primary_email_address_id?: string | null;

    @ApiProperty({
        description: 'Primary phone number ID',
        required: false
    })
    @IsOptional()
    @IsString()
    primary_phone_number_id?: string | null;

    @ApiProperty({
        description: 'Primary web3 wallet ID',
        required: false
    })
    @IsOptional()
    @IsString()
    primary_web3_wallet_id?: string | null;

    @ApiProperty({
        description: 'Public metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    public_metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Private metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    private_metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Unsafe metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    unsafe_metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Profile image URL',
        required: false
    })
    @IsOptional()
    @IsString()
    profile_image_url?: string | null;

    @ApiProperty({
        description: 'Two factor enabled',
        example: false
    })
    @IsBoolean()
    two_factor_enabled!: boolean;

    @ApiProperty({
        description: 'Updated timestamp',
        example: 1640995200000
    })
    @IsNumber()
    updated_at!: number;

    @ApiProperty({
        description: 'Username',
        required: false
    })
    @IsOptional()
    @IsString()
    username?: string | null;

    @ApiProperty({
        description: 'Web3 wallets',
        type: 'array'
    })
    @IsArray()
    web3_wallets!: any[];
}

// Deleted user data DTO
export class DeletedUserDataDto {
    @ApiProperty({
        description: 'Deleted flag',
        example: true
    })
    @IsBoolean()
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

// Organization data DTO
export class OrganizationDataDto {
    @ApiProperty({
        description: 'Organization ID',
        example: 'org_123456'
    })
    @IsString()
    id!: string;

    @ApiProperty({
        description: 'Organization name',
        required: false
    })
    @IsOptional()
    @IsString()
    name?: string | null;

    @ApiProperty({
        description: 'Organization slug',
        required: false
    })
    @IsOptional()
    @IsString()
    slug?: string | null;

    @ApiProperty({
        description: 'Image URL',
        required: false
    })
    @IsOptional()
    @IsString()
    image_url?: string | null;

    @ApiProperty({
        description: 'Logo URL',
        required: false
    })
    @IsOptional()
    @IsString()
    logo_url?: string | null;

    @ApiProperty({
        description: 'Created timestamp',
        example: 1640995200000
    })
    @IsNumber()
    created_at!: number;

    @ApiProperty({
        description: 'Updated timestamp',
        example: 1640995200000
    })
    @IsNumber()
    updated_at!: number;

    @ApiProperty({
        description: 'Created by user ID',
        required: false
    })
    @IsOptional()
    @IsString()
    created_by?: string | null;

    @ApiProperty({
        description: 'Object type',
        example: 'organization'
    })
    @IsString()
    object!: string;

    @ApiProperty({
        description: 'Public metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    public_metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Private metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    private_metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Unsafe metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    unsafe_metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Has image',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    has_image?: boolean;

    @ApiProperty({
        description: 'Max allowed memberships',
        required: false
    })
    @IsOptional()
    @IsNumber()
    max_allowed_memberships?: number;

    @ApiProperty({
        description: 'Members count',
        required: false
    })
    @IsOptional()
    @IsNumber()
    members_count?: number;

    @ApiProperty({
        description: 'Pending invitations count',
        required: false
    })
    @IsOptional()
    @IsNumber()
    pending_invitations_count?: number;

    @ApiProperty({
        description: 'Admin delete enabled',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    admin_delete_enabled?: boolean;
}

// Deleted organization data DTO
export class DeletedOrganizationDataDto {
    @ApiProperty({
        description: 'Deleted flag',
        example: true
    })
    @IsBoolean()
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

// Public user data DTO (for organization membership)
export class PublicUserDataDto {
    @ApiProperty({
        description: 'User ID',
        example: 'user_123456'
    })
    @IsString()
    user_id!: string;

    @ApiProperty({
        description: 'User identifier',
        example: 'user@example.com'
    })
    @IsString()
    identifier!: string;

    @ApiProperty({
        description: 'First name',
        required: false
    })
    @IsOptional()
    @IsString()
    first_name?: string | null;

    @ApiProperty({
        description: 'Last name',
        required: false
    })
    @IsOptional()
    @IsString()
    last_name?: string | null;

    @ApiProperty({
        description: 'Image URL',
        required: false
    })
    @IsOptional()
    @IsString()
    image_url?: string | null;

    @ApiProperty({
        description: 'Profile image URL',
        required: false
    })
    @IsOptional()
    @IsString()
    profile_image_url?: string | null;

    @ApiProperty({
        description: 'Has image',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    has_image?: boolean;
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
        description: 'Organization data',
        type: OrganizationDataDto
    })
    @ValidateNested()
    @Type(() => OrganizationDataDto)
    organization!: OrganizationDataDto;

    @ApiProperty({
        description: 'Public user data',
        type: PublicUserDataDto
    })
    @ValidateNested()
    @Type(() => PublicUserDataDto)
    public_user_data!: PublicUserDataDto;

    @ApiProperty({
        description: 'Role',
        example: 'admin'
    })
    @IsString()
    role!: string;

    @ApiProperty({
        description: 'Created timestamp',
        example: 1640995200000
    })
    @IsNumber()
    created_at!: number;

    @ApiProperty({
        description: 'Updated timestamp',
        example: 1640995200000
    })
    @IsNumber()
    updated_at!: number;

    @ApiProperty({
        description: 'Role name',
        required: false
    })
    @IsOptional()
    @IsString()
    role_name?: string;

    @ApiProperty({
        description: 'Permissions',
        type: 'array',
        required: false
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    permissions?: string[];

    @ApiProperty({
        description: 'Public metadata',
        type: 'object',
        additionalProperties: true
    })
    @IsOptional()
    @IsObject()
    public_metadata?: Record<string, any>;
}

