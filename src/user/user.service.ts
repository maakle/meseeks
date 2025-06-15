import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserDto, UserResponseDto } from './dto';
import { HandleServiceError } from '../common/decorators/error-handler.decorator';
import { UserNotFoundError } from './errors';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleServiceError(UserService.name)
  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundError(id, 'id');
    }

    return new UserResponseDto(user);
  }

  @HandleServiceError(UserService.name)
  async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      throw new UserNotFoundError(phoneNumber, 'phoneNumber');
    }

    return new UserResponseDto(user);
  }

  @HandleServiceError(UserService.name)
  async upsertUser(upsertUserDto: UpsertUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.upsert({
      where: { phoneNumber: upsertUserDto.phoneNumber },
      create: { phoneNumber: upsertUserDto.phoneNumber },
      update: {},
    });

    return new UserResponseDto(user);
  }
}
