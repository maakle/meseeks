import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpsertUserDto, UserResponseDto } from './user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        this.logger.warn(`User not found with id: ${id}`);
        throw new NotFoundException(`User not found with id: ${id}`);
      }

      return new UserResponseDto(user);
    } catch (error) {
      this.logger.error(`Error finding user by id ${id}:`, error);
      throw error;
    }
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        this.logger.warn(`User not found with phone number: ${phoneNumber}`);
        throw new NotFoundException(
          `User not found with phone number: ${phoneNumber}`,
        );
      }

      return new UserResponseDto(user);
    } catch (error) {
      this.logger.error(
        `Error finding user by phone number ${phoneNumber}:`,
        error,
      );
      throw error;
    }
  }

  async upsertUser(upsertUserDto: UpsertUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.upsert({
        where: { phoneNumber: upsertUserDto.phoneNumber },
        create: { phoneNumber: upsertUserDto.phoneNumber },
        update: {},
      });
      return new UserResponseDto(user);
    } catch (error) {
      this.logger.error(
        `Error upserting user with phone number ${upsertUserDto.phoneNumber}:`,
        error,
      );
      throw error;
    }
  }
}
