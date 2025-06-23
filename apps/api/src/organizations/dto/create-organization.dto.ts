import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Clerk organization ID',
    example: 'org_1234567890abcdef'
  })
  @IsString()
  @MinLength(1, { message: 'Clerk organization ID is required' })
  clerkOrganizationId!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp'
  })
  @IsString()
  @MinLength(1, { message: 'Organization name is required' })
  name!: string;

  @ApiProperty({
    description: 'Organization slug',
    example: 'acme-corp'
  })
  @IsString()
  @MinLength(1, { message: 'Organization slug is required' })
  slug!: string;
}
