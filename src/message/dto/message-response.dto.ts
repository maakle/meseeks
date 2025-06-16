import { Message } from 'generated/prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MessageResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.string(),
});

export class MessageResponseDto extends createZodDto(MessageResponseSchema) {}

export const mapToMessageResponseDto = (prisma: Message): MessageResponseDto =>
  MessageResponseDto.create({
    id: prisma.id,
    content: prisma.content,
    role: prisma.role,
  });
