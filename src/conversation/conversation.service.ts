import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  private readonly logger: Logger = new Logger(ConversationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createConversationMessage(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ): Promise<string> {
    try {
      await this.prisma.conversation.create({
        data: {
          content,
          role,
          userId,
        },
      });

      return 'Message Saved!';
    } catch (error) {
      this.logger.error('Error Saving Message', error);
      return 'Error Saving Message';
    }
  }

  async createAndFetchConversationMessages(
    content: string,
    role: 'user' | 'assistant',
    userId: string,
  ): Promise<Array<{ role: string; content: string }>> {
    try {
      await this.prisma.conversation.create({
        data: {
          content,
          role,
          userId,
        },
      });

      const conversations = await this.prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      return conversations.map((conv) => ({
        role: conv.role,
        content: conv.content,
      }));
    } catch (error) {
      this.logger.error('Error Saving Message And Retrieving', error);
      return [];
    }
  }
}
