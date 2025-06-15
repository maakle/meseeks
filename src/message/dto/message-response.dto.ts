import { Message } from 'generated/prisma/client';

export type MessageResponseDto = {
  id: string;
  content: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export const mapToMessageResponseDto = (
  prisma: Message,
): MessageResponseDto => ({
  id: prisma.id,
  content: prisma.content,
  role: prisma.role,
  createdAt: prisma.createdAt,
  updatedAt: prisma.updatedAt,
});
