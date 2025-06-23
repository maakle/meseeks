import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Message } from 'generated/prisma/client';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Message ID',
    example: 'clx1234567890abcdef'
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how can I help you today?'
  })
  @IsString()
  content!: string;

  @ApiProperty({
    description: 'Message role (user/assistant)',
    example: 'assistant'
  })
  @IsString()
  role!: string;
}

export const mapToMessageResponseDto = (prisma: Message): MessageResponseDto => {
  return {
    id: prisma.id,
    content: prisma.content,
    role: prisma.role,
  };
};
