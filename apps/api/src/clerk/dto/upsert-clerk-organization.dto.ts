import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpsertClerkOrganizationDto {
  @ApiProperty({
    description: 'Clerk organization ID',
    example: 'org_2abc123def456'
  })
  @IsString()
  clerkOrganizationId!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiProperty({
    description: 'Organization slug',
    example: 'acme-corp',
    required: false
  })
  @IsOptional()
  @IsString()
  slug?: string | null;

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
    description: 'User who created the organization',
    example: 'user_2abc123def456',
    required: false
  })
  @IsOptional()
  @IsString()
  createdBy?: string | null;
}
