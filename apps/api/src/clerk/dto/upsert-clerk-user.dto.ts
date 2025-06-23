import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpsertClerkUserDto {
  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abc123def456'
  })
  @IsString()
  clerkUserId!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string | null;

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
}
