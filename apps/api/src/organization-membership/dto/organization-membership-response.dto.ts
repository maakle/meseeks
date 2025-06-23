import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

// User DTO for organization membership response
export class OrganizationMembershipUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false
  })
  @IsOptional()
  @IsString()
  email?: string | null;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false
  })
  @IsOptional()
  @IsString()
  firstName?: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false
  })
  @IsOptional()
  @IsString()
  lastName?: string | null;

  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abc123def456',
    required: false
  })
  @IsOptional()
  @IsString()
  clerkUserId?: string | null;
}

// Organization DTO for organization membership response
export class OrganizationMembershipOrganizationDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'org_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Organization slug',
    example: 'acme-corp'
  })
  @IsString()
  slug!: string;

  @ApiProperty({
    description: 'Organization image URL',
    example: 'https://example.com/image.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @ApiProperty({
    description: 'Organization logo URL',
    example: 'https://example.com/logo.png',
    required: false
  })
  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @ApiProperty({
    description: 'Clerk organization ID',
    example: 'org_2abc123def456'
  })
  @IsString()
  clerkOrganizationId!: string;
}

// Organization membership response DTO
export class OrganizationMembershipResponseDto {
  @ApiProperty({
    description: 'Membership ID',
    example: 'membership_123456'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user_123456'
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 'org_123456'
  })
  @IsString()
  organizationId!: string;

  @ApiProperty({
    description: 'Role',
    example: 'admin'
  })
  @IsString()
  role!: string;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    description: 'User information',
    type: OrganizationMembershipUserDto
  })
  @ValidateNested()
  @Type(() => OrganizationMembershipUserDto)
  user!: OrganizationMembershipUserDto;

  @ApiProperty({
    description: 'Organization information',
    type: OrganizationMembershipOrganizationDto
  })
  @ValidateNested()
  @Type(() => OrganizationMembershipOrganizationDto)
  organization!: OrganizationMembershipOrganizationDto;
}

// Organization membership list response DTO
export class OrganizationMembershipListResponseDto {
  @ApiProperty({
    description: 'List of organization memberships',
    type: [OrganizationMembershipResponseDto]
  })
  @ValidateNested({ each: true })
  @Type(() => OrganizationMembershipResponseDto)
  items!: OrganizationMembershipResponseDto[];
}
