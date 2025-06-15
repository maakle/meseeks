import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  private readonly prisma: PrismaClient = new PrismaClient();

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      return new UserResponseDto(user);
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async saveToContext(
    context: string,
    contextType: 'user' | 'assistant',
    phoneNumber: string,
  ): Promise<string> {
    try {
      const user = await this.prisma.user.upsert({
        where: { phoneNumber },
        create: { phoneNumber },
        update: {},
      });

      await this.prisma.conversation.create({
        data: {
          content: context,
          role: contextType,
          userId: user.id,
        },
      });

      return 'Context Saved!';
    } catch (error) {
      this.logger.error('Error Saving Context', error);
      return 'Error Saving Context';
    }
  }

  async saveAndFetchContext(
    context: string,
    contextType: 'user' | 'assistant',
    phoneNumber: string,
  ): Promise<Array<{ role: string; content: string }>> {
    try {
      const user = await this.prisma.user.upsert({
        where: { phoneNumber },
        create: { phoneNumber },
        update: {},
      });

      await this.prisma.conversation.create({
        data: {
          content: context,
          role: contextType,
          userId: user.id,
        },
      });

      const conversations = await this.prisma.conversation.findMany({
        where: { userId: user.id },
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

  async getConversationHistory(
    phoneNumber: string,
  ): Promise<Array<{ role: string; content: string }>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });

      const conversations = await this.prisma.conversation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      });

      return conversations.map((conv) => ({
        role: conv.role,
        content: conv.content,
      }));
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
