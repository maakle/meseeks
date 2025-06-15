import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MessageResponseDto,
  mapToMessageResponseDto,
} from './dto/message-response.dto';
import { HandleServiceError } from '../common/decorators/error-handler.decorator';
import { MessageCreationError, MessageFetchError } from './errors';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleServiceError(MessageService.name)
  async createMessage(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ): Promise<MessageResponseDto> {
    const message = await this.prisma.message
      .create({
        data: {
          content,
          role,
          userId,
        },
      })
      .catch((error) => {
        throw new MessageCreationError(error.message);
      });

    return mapToMessageResponseDto(message);
  }

  @HandleServiceError(MessageService.name)
  async createAndManyFetchMessages(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ): Promise<MessageResponseDto[]> {
    await this.prisma.message
      .create({
        data: {
          content,
          role,
          userId,
        },
      })
      .catch((error) => {
        throw new MessageCreationError(error.message);
      });

    const messages = await this.prisma.message
      .findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      })
      .catch((error) => {
        throw new MessageFetchError(error.message);
      });

    return messages.map(mapToMessageResponseDto);
  }
}
