import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertClerkOrganizationMembershipDto {
  @ApiProperty({
    description: 'Clerk membership ID',
    example: 'membership_2abc123def456'
  })
  @IsString()
  clerkMembershipId!: string;

  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abc123def456'
  })
  @IsString()
  clerkUserId!: string;

  @ApiProperty({
    description: 'Clerk organization ID',
    example: 'org_2abc123def456'
  })
  @IsString()
  clerkOrganizationId!: string;

  @ApiProperty({
    description: 'Role in the organization',
    example: 'admin'
  })
  @IsString()
  role!: string;
}
