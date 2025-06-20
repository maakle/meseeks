import { Injectable } from '@nestjs/common';
import { HandleServiceErrors } from '../common/decorators/error-handler.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertClerkUserDto } from './dto/upsert-clerk-user.dto';
import { UpsertUserDto } from './dto/upsert-user';
import { mapToUserResponseDto, UserResponseDto } from './dto/user-response.dto';
import { UserNotFoundError } from './errors';

@Injectable()
@HandleServiceErrors(UserService.name)
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundError(id, 'id');
    }

    return mapToUserResponseDto(user);
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new UserNotFoundError(phoneNumber, 'phoneNumber');
    }

    return mapToUserResponseDto(user);
  }

  async findUserByClerkId(clerkUserId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new UserNotFoundError(clerkUserId, 'clerkUserId');
    }

    return mapToUserResponseDto(user);
  }

  async upsertUser(dto: UpsertUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.upsert({
      where: { phoneNumber: dto.phoneNumber },
      create: {
        phoneNumber: dto.phoneNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      update: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return mapToUserResponseDto(user);
  }

  async upsertClerkUser(dto: UpsertClerkUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.upsert({
      where: { clerkUserId: dto.clerkUserId },
      create: {
        clerkUserId: dto.clerkUserId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      update: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return mapToUserResponseDto(user);
  }

  async deleteUserByClerkId(clerkUserId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new UserNotFoundError(clerkUserId, 'clerkUserId');
    }

    await this.prisma.user.delete({
      where: { clerkUserId },
    });
  }
}
