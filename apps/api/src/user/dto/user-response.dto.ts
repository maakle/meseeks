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
}

export const mapToUserResponseDto = (prisma: User): UserResponseDto => {
  return {
    id: prisma.id,
    phoneNumber: prisma.phoneNumber,
    email: prisma.email,
  };
};
