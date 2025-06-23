import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { User } from 'generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clx1234567890abcdef'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    nullable: true
  })
  @IsOptional()
  @IsString()
  phoneNumber!: string | null;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    nullable: true
  })
  @IsOptional()
  @IsString()
  email!: string | null;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true
  })
  @IsOptional()
  @IsString()
  firstName!: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true
  })
  @IsOptional()
  @IsString()
  lastName!: string | null;
}

export const mapToUserResponseDto = (prisma: User): UserResponseDto => {
  return {
    id: prisma.id,
    phoneNumber: prisma.phoneNumber,
    email: prisma.email,
    firstName: prisma.firstName,
    lastName: prisma.lastName,
  }
};
