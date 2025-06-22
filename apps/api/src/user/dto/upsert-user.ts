import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;

export class UpsertUserDto {
  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+1234567890'
  })
  @IsString()
  @Matches(phoneNumberRegex, {
    message: 'Phone number must be in E.164 format (e.g., +1234567890)',
  })
  phoneNumber!: string;
}
