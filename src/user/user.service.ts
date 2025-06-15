import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { UpsertUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  private readonly prisma: PrismaClient = new PrismaClient();

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  async upsertUser(upsertUserDto: UpsertUserDto) {
    return this.prisma.user.upsert({
      where: { phoneNumber: upsertUserDto.phoneNumber },
      create: { phoneNumber: upsertUserDto.phoneNumber },
      update: {},
    });
  }

  async saveToContext(
    context: string,
    contextType: 'user' | 'assistant',
    userId: string,
  ): Promise<string> {
    try {
      await this.prisma.conversation.create({
        data: {
          content: context,
          role: contextType,
          userId,
        },
      });

      return 'Context Saved!';
    } catch (error) {
      this.logger.error('Error Saving Context', error);
      return 'Error Saving Context';
    }
  }

  async createAndFetchContext(
    context: string,
    contextType: 'user' | 'assistant',
    userId: string,
  ): Promise<Array<{ role: string; content: string }>> {
    try {
      await this.prisma.conversation.create({
        data: {
          content: context,
          role: contextType,
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
      this.logger.error('Error Saving Context And Retrieving', error);
      return [];
    }
  }
}
