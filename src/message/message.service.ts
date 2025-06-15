import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  private readonly logger: Logger = new Logger(MessageService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createMessage(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ) {
    try {
      return await this.prisma.message.create({
        data: {
          content,
          role,
          userId,
        },
      });
    } catch (error) {
      this.logger.error('Error Saving Message', error);
      return 'Error Saving Message';
    }
  }

  async createAndManyFetchMessages(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ): Promise<Array<{ role: string; content: string }>> {
    try {
      await this.prisma.message.create({
        data: {
          content,
          role,
          userId,
        },
      });

      const messages = await this.prisma.message.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      return messages.map((conv) => ({
        role: conv.role,
        content: conv.content,
      }));
    } catch (error) {
      this.logger.error('Error Saving Message And Retrieving', error);
      return [];
    }
  }
}
